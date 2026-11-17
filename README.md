# WEB-115-Final-Project-Group-5
# Final Project: Last survivors

## Table of Contents
- [Team Members and Roles](#team-members-and-roles)
- [Application Overview](#application-overview)
- [Story Flowchart](#story-flowchart)

## Team Members and Roles

| Team Member | Role | Responsibilities |
|-------------|------|------------------|
| Ming Chen | Project Lead | Coordinates meetings, manages repo, final review |
| David Kirby Dean | Story & Gameplay Designer | Writes the narrative, designs decision points |
| Daniel Santiago Freire Leyton | Documentation Lead | Maintains README |

## Application Overview

**The Last survivors** is a text-based choose-your-own-adventure survival game. The player wakes up alone in an abandoned city with no supplies and no memory of how they got there. To survive, they must scavenge for resources, decide how to leave the city, navigate dangerous encounters on the road, and finally attempt to gain entry into **Haven** a rumored survivor settlement.

**Rules & Navigation:**
- Each screen presents a scene and a set of numbered choices.
- The player pick of their choice to proceed.
- Some choices lead to dead ends or alternate endings.
- The game has three possible endings depending on the player's decisions.

## Story Flowchart
```mermaid
flowchart TD
    A([START]) --> B[Wake Up in Abandoned City]
    B --> C{Where do you search for supplies?}

    C -->|Hospital| D[Search Abandoned Hospital]
    C -->|Grocery Store| E[Search Grocery Store]

    D --> F[Find Medical Supplies and Radio Transmission]
    E --> G[Find Food and Water]
    G --> H[Encounter Hostile Scavengers]

    F --> I{How do you leave the city?}
    H --> I

    I -->|Highway| J[Encounter Dangerous Roadblock]
    I -->|Forest| K[Discover Injured Survivor]

    J --> L{How do you handle the roadblock?}
    L -->|Sneak Around| M[Find a Safe Route]
    L -->|Confront Them| N[Risk Injury and Lose Supplies]

    K --> O{Help the Survivor?}
    O -->|Yes| P[Help Survivor]
    O -->|No| Q[Continue Alone]

    P --> R[Survivor Reveals Location of Haven]
    Q --> S[Discover an Old Map to Haven]

    M --> T[Travel Toward Haven]
    N --> T
    R --> T
    S --> T

    T --> U{How do you enter Haven?}

    U -->|Show Proof| V[Present Supplies or Information]
    U -->|Force Entry| W[Attempt to Break Through the Gate]

    V --> X{Are You Accepted?}
    X -->|Yes| Y([ENDING 1: A New Beginning])
    X -->|No| Z([ENDING 2: Survival at a Cost])

    W --> AA{Does Entry Succeed?}
    AA -->|Yes| Z
    AA -->|No| AB([ENDING 3: The Final Journey])
```
