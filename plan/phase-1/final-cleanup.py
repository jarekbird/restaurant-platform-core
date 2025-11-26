#!/usr/bin/env python3
"""
Final cleanup - remove orphaned test cases and fix formatting
"""

import re
from pathlib import Path

def cleanup_file(task_file_path: Path):
    """Clean up a task file"""
    with open(task_file_path, 'r') as f:
        content = f.read()
    
    original = content
    
    # Remove orphaned test cases between "## Related Tasks" and "## Test Cases / User Stories"
    # Find the section between these two headers
    pattern = r'(## Related Tasks.*?\n\n)(.*?)(## Test Cases / User Stories)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        before = match.group(1)
        middle = match.group(2)
        after = match.group(3)
        
        # Remove any test case items from middle
        middle_clean = re.sub(r'### Test Case \d+:.*?(?=\n---|\n## |$)', '', middle, flags=re.DOTALL)
        # Remove empty lines and separators
        middle_clean = re.sub(r'\n{3,}', '\n\n', middle_clean)
        middle_clean = re.sub(r'---\s*\n\s*---', '---', middle_clean)
        middle_clean = re.sub(r'^---\s*$', '', middle_clean, flags=re.MULTILINE)
        middle_clean = middle_clean.strip()
        
        if middle_clean:
            content = before + middle_clean + '\n\n' + after + content[content.find(after) + len(after):]
        else:
            content = before + after + content[content.find(after) + len(after):]
    
    # Fix Definition of Done formatting - ensure proper spacing
    content = re.sub(
        r'\*\*Definition of Done\*\*:\s*"([^"]+)"\s*\*\*Test Verification',
        r'**Definition of Done**: "\1"\n\n**Test Verification',
        content
    )
    
    # Fix multiple newlines
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    if content != original:
        with open(task_file_path, 'w') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Main function"""
    tasks_dir = Path(__file__).parent / "tasks"
    task_files = sorted(tasks_dir.glob("*.md"))
    
    cleaned = 0
    for task_file in task_files:
        if cleanup_file(task_file):
            cleaned += 1
    
    print(f"Cleaned {cleaned} task files")

if __name__ == '__main__':
    main()

