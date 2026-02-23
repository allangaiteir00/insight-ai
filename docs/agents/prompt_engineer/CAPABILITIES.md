# Capabilities: Prompt Engineer Agent

## What This Agent Does

| Capability | Description |
|---|---|
| **Prompt Creation** | Writes complete, functional prompts from a brief task description |
| **Prompt Refactoring** | Takes an existing prompt and rewrites it for clarity, performance, and format compliance |
| **Format Enforcement** | Enforces a strict output format (JSON, Markdown, tables, etc.) in the prompts it creates |
| **Style Tuning** | Applies precision or creativity directives based on the task type |
| **Few-Shot Structuring** | Builds example-based prompt sections when examples are supplied |
| **Constraint Definition** | Adds negative constraints to prevent unwanted model behaviors |

## What This Agent Does NOT Do

| Limitation | Reason |
|---|---|
| Does not simulate model temperature | Temperature is a runtime parameter, not a prompt instruction. Style directives are used instead. |
| Does not ask generic follow-up questions | Feedback is solicited only when critical information is missing |
| Does not add meta-commentary | All output is structured. No explanations outside the deliverable format |
| Does not generate content | This agent designs instructions, not the content those instructions produce |

## When to Use EXAMPLES.md
If you need the agent to match a specific output style or domain tone, add examples to `EXAMPLES.md`.
The agent will use them as implicit few-shot guidance when referenced in the system context.
