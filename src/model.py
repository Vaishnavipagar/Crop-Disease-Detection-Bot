import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io
import math
from .dict import return_info, cart, get_dict, healthy_leaf


class ECALayer(nn.Module):
    """
    Efficient Channel Attention Layer
    """
    def __init__(self, channel, b=1, gamma=2):
        super(ECALayer, self).__init__()
        kernel_size = int(abs((math.log2(channel) / gamma) + b) / 2)
        kernel_size = kernel_size if kernel_size % 2 else kernel_size + 1

        self.avg_pool = nn.AdaptiveAvgPool2d(1) # Global average pooling
        self.conv = nn.Conv1d(1, 1, kernel_size=kernel_size, padding=(kernel_size - 1) // 2, bias=False)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Get channel attention weights
        y = self.avg_pool(x).squeeze(-1).squeeze(-1) # Global average pooling
        y = self.conv(y.unsqueeze(1)).squeeze(1) # Apply 1D convolution
        y = self.sigmoid(y)

        # Apply channel attention
        return x * y.unsqueeze(-1).unsqueeze(-1) # Reshape for broadcasting

class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=3):
        super(SpatialAttention, self).__init__()
        self.conv = nn.Conv2d(2, 1, kernel_size, padding=kernel_size // 2, bias=False)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        z = torch.cat([avg_out, max_out], dim=1)
        z = self.conv(z)
        spatial_attention_weight = self.sigmoid(z)
        return x * spatial_attention_weight


class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, in_planes, planes, stride=1, use_eca=False, use_spatial=False):
        super(BasicBlock, self).__init__()
        self.conv1 = nn.Conv2d(
            in_planes, planes, kernel_size=3, stride=stride, padding=1, bias=False
        )
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(
            planes, planes, kernel_size=3, stride=1, padding=1, bias=False
        )
        self.bn2 = nn.BatchNorm2d(planes)
        self.eca = ECALayer(planes) if use_eca else nn.Identity()
        self.spatial_attn = SpatialAttention() if use_spatial else nn.Identity()
        self.shortcut = nn.Sequential()
        if stride != 1 or in_planes != self.expansion * planes:
            self.shortcut = nn.Sequential(
                nn.Conv2d(
                    in_planes,
                    self.expansion * planes,
                    kernel_size=1,
                    stride=stride,
                    bias=False,
                ),
                nn.BatchNorm2d(self.expansion * planes),
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out = self.eca(out)
        out = self.spatial_attn(out)
        out += self.shortcut(x)
        out = F.relu(out)
        return out


class ResNet9_Hybrid(nn.Module):
    def __init__(self, num_classes=4, use_eca=True, use_spatial=True):
        super(ResNet9_Hybrid, self).__init__()
        self.in_planes = 64
        self.conv1 = nn.Conv2d(3, 64, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.layer1 = self._make_layer(
            BasicBlock, 64, 2, stride=1, use_eca=use_eca, use_spatial=use_spatial
        )
        self.layer2 = self._make_layer(
            BasicBlock, 128, 2, stride=2, use_eca=use_eca, use_spatial=use_spatial
        )
        self.layer3 = self._make_layer(
            BasicBlock, 256, 2, stride=2, use_eca=use_eca, use_spatial=use_spatial
        )
        self.layer4 = self._make_layer(
            BasicBlock, 512, 2, stride=2, use_eca=use_eca, use_spatial=use_spatial
        )
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.linear = nn.Linear(512 * BasicBlock.expansion, num_classes)

    def _make_layer(self, block, planes, num_blocks, stride, use_eca, use_spatial):
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for stride in strides:
            layers.append(block(self.in_planes, planes, stride, use_eca, use_spatial))
            self.in_planes = planes * block.expansion
        return nn.Sequential(*layers)

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)
        out = self.avgpool(out)
        out = torch.flatten(out, 1)
        out = self.linear(out)
        return out


disease_classes = [
    "Grape__Black_rot",
    "Grape__Esca_(Black_Measles)",
    "Grape__Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape__healthy",
]

num_classes = len(disease_classes)
disease_model_path = "best_resnet9_hybrid_model.pth"

device = torch.device('cpu') # torch.device('cuda' if torch.cuda.is_available() else 'cpu')

disease_model = ResNet9_Hybrid(num_classes=num_classes, use_eca=True, use_spatial=True)
disease_model.load_state_dict(
    torch.load(disease_model_path, map_location=device, weights_only=True)
)
disease_model.eval()


valid_transforms = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)

CONFIDENCE_THRESHOLD = 0.98

def predict_image(image_input, model=disease_model):
    try:
        if isinstance(image_input, str):
            # If it's a file path, open the image directly
            image = Image.open(image_input).convert("RGB")
        else:
            # If it's bytes, use BytesIO
            image = Image.open(io.BytesIO(image_input)).convert("RGB")
        input_tensor = valid_transforms(image).unsqueeze(0)
        input_tensor = input_tensor.cpu()
        
        model.to(device)

        with torch.no_grad():  # Disable gradient calculation for inference
            output = model(input_tensor)
            probabilities = torch.softmax(output, dim=1)  # Get probabilities
            confidence, predicted_class_idx = torch.max(
                probabilities, 1
            )  # Get max probability and index
            predicted_class_name = disease_classes[
                predicted_class_idx.item()
            ]  # Get class name from index
            
            # --- Apply Thresholding Logic ---
            if confidence.item() >= CONFIDENCE_THRESHOLD:
                disease_info = return_info(predicted_class_name)
                product_info = cart(predicted_class_name)
                display_name = get_disease_display_name(predicted_class_name)
                
                return {
                    'prediction': display_name,
                    'class_name': predicted_class_name,
                    'info': disease_info,
                    'product': product_info
                }
            else:
                return {
                    'prediction': 'Unclassified',
                    'class_name': 'Unclassified',
                    'info': 'The image cannot be classified with sufficient confidence. Please provide a clearer image of a grape leaf.',
                    'product': None
                }
                
    except Exception as e:
        return {
            'prediction': 'Error',
            'info': f'Error processing image: {str(e)}',
            'product': None
        }
    


def get_disease_display_name(disease_class_name):
    """Get the user-friendly disease name from the class name"""
    if disease_class_name in healthy_leaf:
        return "Healthy Grape Leaf"
    
    disease_info = get_dict(disease_class_name)
    if disease_info and "Name" in disease_info:
        return disease_info["Name"]
    
    # Fallback: format the class name nicely
    return disease_class_name.replace("__", " - ").replace("_", " ").title()

# Test the model on some images
# print(predict_image("WhatsApp Image 2025-02-09 at 17.12.54_b51aa45b.jpg"))
