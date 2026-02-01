
from PIL import Image
import os
import sys

def resize_icon(input_path, output_dir):
    try:
        img = Image.open(input_path)
        sizes = [16, 32, 48, 128]
        for size in sizes:
            out_name = f"icon{size}.png"
            out_path = os.path.join(output_dir, out_name)
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(out_path, "PNG")
            print(f"Created {out_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Input is the large generated icon
    # Input is the large generated icon
    input_image = r"C:\Users\Admin\.gemini\antigravity\brain\835bbe47-e617-4fb0-a01f-4166269ba8fe\extension_icon_source_1769938452321.png"
    output_directory = r"c:\Users\Admin\Desktop\翻译\assets"
    
    # Create directory if not exists
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
        
    resize_icon(input_image, output_directory)
