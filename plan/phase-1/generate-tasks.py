#!/usr/bin/env python3
"""
Generate individual task files from execution-order.md following Task Layout.md template
"""

import re
import os
from pathlib import Path

def parse_execution_order():
    """Parse execution-order.md and extract all tasks"""
    exec_order_path = Path(__file__).parent / "execution-order.md"
    with open(exec_order_path, 'r') as f:
        content = f.read()
    
    tasks = []
    lines = content.split('\n')
    current_stage = None
    current_task = None
    in_task = False
    collecting_actions = False
    collecting_tests = False
    
    for i, line in enumerate(lines):
        # Match stage headers
        stage_match = re.match(r'^## (Stage [A-Z] — .+)', line)
        if stage_match:
            current_stage = stage_match.group(1)
            continue
        
        # Match task headers: "1. **[T-001] Title**" or "10. **[T-021] Title**"
        task_match = re.match(r'^(\d+)\.\s+\*\*\[(T-\d+)\]\s+(.+?)\*\*', line)
        if task_match:
            if current_task:
                tasks.append(current_task)
            task_num = int(task_match.group(1))
            task_id = task_match.group(2)
            task_title = task_match.group(3)
            current_task = {
                'number': task_num,
                'id': task_id,
                'title': task_title,
                'stage': current_stage,
                'depends_on': [],
                'actions': [],
                'tests': [],
                'description': ''
            }
            in_task = True
            collecting_actions = False
            collecting_tests = False
            continue
        
        if not current_task:
            continue
        
        # Match dependencies
        if '- Depends on:' in line or 'Depends on:' in line:
            deps = re.findall(r'\[(T-\d+)\]', line)
            current_task['depends_on'] = deps
            continue
        
        # Match Actions section
        if 'Actions:' in line or '- Actions:' in line:
            collecting_actions = True
            collecting_tests = False
            continue
        
        # Match Tests section
        if '- Tests:' in line or 'Tests:' in line:
            collecting_actions = False
            collecting_tests = True
            continue
        
        # Collect actions
        if collecting_actions and line.strip().startswith('- '):
            action = line.strip()[2:]
            if action and not action.startswith('Depends on'):
                current_task['actions'].append(action)
        
        # Collect tests
        if collecting_tests and line.strip().startswith('- '):
            test = line.strip()[2:]
            if test:
                current_task['tests'].append(test)
    
    if current_task:
        tasks.append(current_task)
    
    return tasks

def get_stage_info(stage_name):
    """Map stage names to section info"""
    stage_map = {
        'Stage A — Tooling & Baseline App Health (Prep for all later phases)': {
            'section': 'A',
            'name': 'Tooling & Baseline App Health'
        },
        'Stage B — Phase 0: Bootstrap the Core App': {
            'section': 'B',
            'name': 'Phase 0: Bootstrap the Core App'
        },
        'Stage C — Phase 1: Domain Modeling (Menu & Restaurant Config)': {
            'section': 'C',
            'name': 'Phase 1: Domain Modeling'
        },
        'Stage D — Phase 2: Core UI Components (Template Library)': {
            'section': 'D',
            'name': 'Phase 2: Core UI Components'
        },
        'Stage E — Phase 3: Routing & Preview Pages': {
            'section': 'E',
            'name': 'Phase 3: Routing & Preview Pages'
        },
        'Stage F — Phase 4: Theme System': {
            'section': 'F',
            'name': 'Phase 4: Theme System'
        },
        'Stage G — Phase 5: AI Menu Ingestion Tooling (Skeleton)': {
            'section': 'G',
            'name': 'Phase 5: AI Menu Ingestion Tooling'
        },
        'Stage H — Phase 6: Restaurant Scaffolding & Per-Restaurant Repos': {
            'section': 'H',
            'name': 'Phase 6: Restaurant Scaffolding'
        },
        'Stage I — Phase 7: Demo Restaurant Implementations': {
            'section': 'I',
            'name': 'Phase 7: Demo Restaurant Implementations'
        },
        'Stage J — Phase 8: Internal Docs for AI Agents & Yourself': {
            'section': 'J',
            'name': 'Phase 8: Internal Documentation'
        }
    }
    return stage_map.get(stage_name, {'section': '?', 'name': stage_name})

def determine_task_type(task):
    """Determine the task type based on content"""
    title_lower = task['title'].lower()
    actions_text = ' '.join(task['actions']).lower()
    
    if 'install' in title_lower or 'dependency' in title_lower:
        return 'SYSTEM/ENVIRONMENT OPERATION'
    if 'test' in title_lower and 'write' not in title_lower and 'add' not in title_lower:
        return 'TESTING'
    if 'write' in title_lower or 'document' in title_lower or 'docs' in title_lower:
        return 'DOCUMENTATION'
    if 'create' in title_lower or 'implement' in title_lower or 'add' in title_lower:
        if 'test' in actions_text:
            return 'CODE/FILE WRITING'  # Code + tests
        return 'CODE/FILE WRITING'
    if 'configure' in title_lower or 'setup' in title_lower:
        return 'CONFIGURATION'
    return 'CODE/FILE WRITING'

def generate_task_file(task, tasks_list):
    """Generate a task file following the template"""
    stage_info = get_stage_info(task['stage'])
    task_type = determine_task_type(task)
    
    # Find previous and next tasks
    prev_task = None
    next_task = None
    for i, t in enumerate(tasks_list):
        if t['id'] == task['id']:
            if i > 0:
                prev_task = tasks_list[i-1]
            if i < len(tasks_list) - 1:
                next_task = tasks_list[i+1]
            break
    
    # Build dependencies list
    deps_list = []
    for dep_id in task['depends_on']:
        dep_task = next((t for t in tasks_list if t['id'] == dep_id), None)
        if dep_task:
            deps_list.append(f"- {dep_id}: {dep_task['title']}")
    
    # Build related tasks
    related = []
    for dep_id in task['depends_on']:
        dep_task = next((t for t in tasks_list if t['id'] == dep_id), None)
        if dep_task:
            related.append(f"- {dep_id}: {dep_task['title']}")
    
    # Format task number with leading zeros
    task_num_str = f"{task['number']:03d}"
    
    # Build strings for template
    deps_str = ', '.join([f"[{d}]" for d in task['depends_on']]) if task['depends_on'] else 'None (can start immediately)'
    independence_str = 'Can be completed independently' if not task['depends_on'] else 'Requires dependencies to be completed first'
    
    # Build description from actions
    description = task['title'] + ". "
    if task['actions']:
        description += "This task involves: " + "; ".join(task['actions'][:3])
        if len(task['actions']) > 3:
            description += "; and more."
    description += f" This task is part of {stage_info['name']} and contributes to building the restaurant platform core application."
    
    content = f"""# TASK-{task_num_str}: {task['title']}

**Section**: {stage_info['section']}. {stage_info['name']}
**Subsection**: {stage_info['section']}.{task['number']}
**Task ID**: {task['id']}

## Description

{description}

**Reference Implementation**: `plan/phase-1/master-plan.md`

## Current State

- Previous tasks: {', '.join([f"[{d}]" for d in task['depends_on']]) if task['depends_on'] else 'None'}
- Current limitations: Dependencies must be completed before starting this task
- Relevant context: See execution-order.md for full task details

**Important**: This task depends on: {', '.join([f"[{d}]" for d in task['depends_on']]) if task['depends_on'] else 'None'}

## Checklist

### Preparation and Setup

- [ ] Review relevant documentation and reference implementations
- [ ] Understand dependencies and prerequisites: {', '.join([f"[{d}]" for d in task['depends_on']]) if task['depends_on'] else 'None'}
- [ ] Set up any required tooling or environment
- [ ] Review related tasks and their status
- [ ] Identify any blockers or risks

### Implementation Steps

"""
    
    # Add implementation steps from actions
    for i, action in enumerate(task['actions'], 1):
        content += f"- [ ] Step {i}: {action}\n"
    
    if not task['actions']:
        content += "- [ ] Implement the required functionality as specified in execution-order.md\n"
    
    content += f"""
### Specific Requirements

- [ ] All requirements from execution-order.md must be met
- [ ] Code must follow Global Rules.md guidelines
- [ ] Type safety must be maintained (TypeScript)
- [ ] Error handling must be implemented appropriately

### Error Handling and Edge Cases

- [ ] Handle error cases appropriately
- [ ] Test edge cases
- [ ] Ensure proper validation

### Testing

"""
    
    if task['tests']:
        for test in task['tests']:
            content += f"- [ ] {test}\n"
    else:
        content += "- [ ] Write appropriate tests if required\n"
    
    content += f"""- [ ] Run full test suite: `npm test`
- [ ] Run type checking: `npm run build` (TypeScript check)
- [ ] Run linting: `npm run lint`
- [ ] **DO NOT manually test by running the server** - use automated tests instead
- [ ] Ensure all affected functionality is covered by automated tests

### Documentation

- [ ] Update code comments and JSDoc/TSDoc as needed
- [ ] Update relevant documentation files if structural changes were made
- [ ] Document any patterns or conventions established

### Verification

- [ ] Verify all requirements are met
- [ ] Verify no regressions were introduced
- [ ] Verify code quality standards are met
- [ ] Review code for best practices
- [ ] Ensure proper error handling is in place

## Notes

- This task is part of **{stage_info['name']}**
- **Execution Timing**: Execute after completing dependencies: {deps_str}
- **Dependencies**: {deps_str.replace(' (can start immediately)', '') if '(can start immediately)' in deps_str else (', '.join([f"[{d}]" for d in task['depends_on']]) if task['depends_on'] else 'None')}
- **Important Considerations**: 
  - Follow Global Rules.md for all implementation
  - Maintain type safety with TypeScript
  - Write comprehensive tests
  - Follow Next.js and React best practices
- **Task Independence**: {independence_str}
- **Current State**: See execution-order.md for detailed current state information

## Related Tasks

"""
    
    if prev_task:
        content += f"- Previous: TASK-{prev_task['number']:03d} ({prev_task['id']})\n"
    else:
        content += "- Previous: None\n"
    
    if next_task:
        content += f"- Next: TASK-{next_task['number']:03d} ({next_task['id']})\n"
    else:
        content += "- Next: None\n"
    
    if task['depends_on']:
        content += "- Dependencies:\n"
        for dep_id in task['depends_on']:
            dep_task = next((t for t in tasks_list if t['id'] == dep_id), None)
            if dep_task:
                content += f"  - {dep_id}: {dep_task['title']}\n"
    
    content += f"""
## Definition of Done

This is a **{task_type} TASK**.

"""
    
    if task_type == 'SYSTEM/ENVIRONMENT OPERATION':
        content += """**Definition of Done**: "The required operation must complete successfully with no errors, and the expected artifacts must be created. If any part of the operation fails, the task is NOT complete."

**Important Notes**:
- Installing dependencies requires packages to actually be installed successfully
- Updating package.json is NOT enough
- If the output mentions environmental issues, errors, warnings, or failed operations, the task is NOT complete
"""
    elif task_type == 'DOCUMENTATION':
        content += """**Definition of Done**: "Documentation files are created or updated with accurate, complete information and committed to git"
"""
    elif task_type == 'TESTING':
        content += """**Definition of Done**: "Tests are written, all tests pass, and test coverage meets project requirements (if applicable)"
"""
    elif task_type == 'CONFIGURATION':
        content += """**Definition of Done**: "Configuration is complete, verified to work correctly, and committed to git"
"""
    else:  # CODE/FILE WRITING
        content += """**Definition of Done**: "A Pull Request was created OR code was pushed to origin with the task complete"

**Examples**:
- Creating new source code files
- Modifying existing source code files
- Implementing features, functions, classes, modules
- Writing tests, specs
- Refactoring code
- Fixing bugs in source code
"""
    
    return content

def main():
    """Main function to generate all task files"""
    tasks = parse_execution_order()
    tasks_dir = Path(__file__).parent / "tasks"
    tasks_dir.mkdir(exist_ok=True)
    
    print(f"Found {len(tasks)} tasks")
    
    for task in tasks:
        task_num_str = f"{task['number']:03d}"
        task_file = tasks_dir / f"{task_num_str}.md"
        
        content = generate_task_file(task, tasks)
        
        with open(task_file, 'w') as f:
            f.write(content)
        
        print(f"Generated {task_num_str}.md: {task['title']}")
    
    print(f"\nGenerated {len(tasks)} task files in {tasks_dir}")

if __name__ == '__main__':
    main()

