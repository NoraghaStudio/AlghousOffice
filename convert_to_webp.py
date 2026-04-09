import os
import glob
import subprocess

directory = '/home/bin-naqeeb/Documents/web design/AlghousOffice'

def convert_and_replace():
    # Find all image paths
    image_extensions = ('*.png', '*.jpg', '*.jpeg', '*.PNG', '*.JPG', '*.JPEG')
    images = []
    for ext in image_extensions:
        images.extend(glob.glob(f"{directory}/**/{ext}", recursive=True))
    
    for img_path in images:
        webp_path = os.path.splitext(img_path)[0] + '.webp'
        if not os.path.exists(webp_path):
            print(f"Converting {img_path} to {webp_path}")
            subprocess.run(['convert', img_path, '-quality', '80', webp_path])
        
        # Check if converted successfully, then remove original
        if os.path.exists(webp_path):
            os.remove(img_path)

    # Now replace occurrences in index.html, style.css, script.js
    files_to_update = [
        os.path.join(directory, 'index.html'),
        os.path.join(directory, 'style.css'),
        os.path.join(directory, 'script.js')
    ]
    
    for file_path in files_to_update:
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace('.jpg', '.webp')
        content = content.replace('.jpeg', '.webp')
        content = content.replace('.png', '.webp')
        content = content.replace('.JPG', '.webp')
        content = content.replace('.JPEG', '.webp')
        content = content.replace('.PNG', '.webp')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    convert_and_replace()
