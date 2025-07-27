# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI Guidance

After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
Before you finish, please verify your solution.

## Documentation Updates

The below updates occur when:

1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update CLAUDE.md**
4. When context needs clarification

Update them concisely to avoid token bloat.

## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

Core Context Files
CLAUDE-activeContext.md - Current session state, goals, and progress (if exists).
CLAUDE-patterns.md - Established code patterns and conventions (if exists)
CLAUDE-troubleshooting.md - Common issues and proven solutions (if exists)
Important: Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

Keep these files below 100 lines if possible
