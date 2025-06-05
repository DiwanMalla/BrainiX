import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for 3D Design with Blender...");

  // Fetch the 3D Design with Blender course
  const course = await prisma.course.findUnique({
    where: { slug: "3d-design-blender" },
  });

  if (!course) {
    console.error("Course with slug '3d-design-blender' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Blender and 3D Design",
      description: "Learn the basics of 3D design and Blender’s interface.",
      position: 1,
      lessons: [
        {
          title: "What is 3D Design?",
          description: "Explore 3D design and its applications.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Blender Interface",
          description: "Navigate Blender’s workspace.",
          type: "TEXT",
          content: `
# Blender Interface

1. **Workspace**:
   - 3D Viewport: Main modeling area.
   - Outliner: Scene hierarchy.
   - Properties: Adjust object settings.

2. **Tools**:
   - Move, Rotate, Scale (G, R, S keys).
   - Example: Create a cube:
     \`\`\`
     Shift + A > Mesh > Cube
     \`\`\`

3. **Modes**:
   - Object Mode, Edit Mode (Tab key).

**Practice**:
- Open Blender and add a cube.
- Switch to Edit Mode and scale it.
- Write a 150-word summary of the interface.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "First 3D Model",
          description: "Create a simple 3D object.",
          type: "TEXT",
          content: `
# First 3D Model

1. **Add Object**:
   - Shift + A > Mesh > Cylinder.
   - Example: Adjust radius in Properties.

2. **Transform**:
   - Press G (Grab) to move, S (Scale) to resize.
   - Example:
     \`\`\`
     Scale: S, then 0.5
     \`\`\`

3. **Render**:
   - Press F12 to render.

**Practice**:
- Create a cylinder and scale it.
- Render and save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: 3D Design Basics",
          description: "Test your understanding of 3D design and Blender.",
          type: "QUIZ",
          content: `
# Quiz: 3D Design Basics

**Instructions**: Answer the following questions.

1. **What is 3D design used for?**
   - A) Text editing
   - B) Creating models
   - C) Data analysis
   - D) 2D drawing
   - **Answer**: B

2. **Which panel shows scene hierarchy?**
   - A) 3D Viewport
   - B) Outliner
   - C) Properties
   - D) Timeline
   - **Answer**: B

3. **How do you render in Blender?**
   - **Answer**: Press F12
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "3D Modeling Fundamentals",
      description: "Master basic modeling techniques in Blender.",
      position: 2,
      lessons: [
        {
          title: "Introduction to 3D Modeling",
          description: "Learn modeling concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Box Modeling",
          description: "Create models using box modeling.",
          type: "TEXT",
          content: `
# Box Modeling

1. **Start with Cube**:
   - Shift + A > Mesh > Cube.
   - Enter Edit Mode (Tab).

2. **Extrude**:
   - Select face, press E to extrude.
   - Example: Extrude to form a house shape.

3. **Loop Cuts**:
   - Ctrl + R to add edge loops.

**Practice**:
- Model a simple house using box modeling.
- Add 2 loop cuts.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Modifiers",
          description: "Use modifiers to enhance models.",
          type: "TEXT",
          content: `
# Modifiers

1. **Subdivision Surface**:
   - Add modifier: Properties > Modifiers > Subdivision Surface.
   - Example: Smooth a cube.

2. **Mirror**:
   - Add Mirror modifier for symmetry.

**Practice**:
- Apply Subdivision Surface to a sphere.
- Use Mirror modifier on a half-model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: 3D Model",
          description: "Create a 3D model with modifiers.",
          type: "ASSIGNMENT",
          content: `
# Assignment: 3D Model

**Objective**: Build a 3D object.

**Requirements**:
- Model a simple object (e.g., chair).
- Use box modeling and 2 modifiers.
- Render as PNG.
- Write a 300-word report on modeling process.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Texturing and Materials",
      description: "Apply textures and materials to 3D models.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Texturing",
          description: "Learn texturing basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Materials",
          description: "Design materials in Shader Editor.",
          type: "TEXT",
          content: `
# Creating Materials

1. **Shader Editor**:
   - Select object, go to Shader Editor.
   - Add Principled BSDF shader.

2. **Properties**:
   - Adjust Base Color, Roughness.
   - Example:
     \`\`\`
     Base Color: #FF0000
     Roughness: 0.5
     \`\`\`

**Practice**:
- Create a red plastic material for a cube.
- Render and save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "UV Mapping",
          description: "Apply textures with UV mapping.",
          type: "TEXT",
          content: `
# UV Mapping

1. **Unwrap**:
   - In Edit Mode, select all (A), press U > Smart UV Unwrap.
   - Example: Unwrap a cylinder.

2. **Apply Texture**:
   - Add Image Texture node in Shader Editor.
   - Load PNG texture.

**Practice**:
- UV unwrap a model and apply a texture.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Textured Model",
          description: "Texture a 3D model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Textured Model

**Objective**: Apply materials and textures.

**Requirements**:
- Model a simple object (e.g., cup).
- Create a material and apply a texture via UV mapping.
- Render as PNG.
- Write a 300-word report on texturing process.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Lighting and Rendering",
      description: "Set up lighting and render high-quality images.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Lighting",
          description: "Learn lighting techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Types of Lights",
          description: "Use different light sources.",
          type: "TEXT",
          content: `
# Types of Lights

1. **Point Light**:
   - Shift + A > Light > Point.
   - Example: Set Power to 1000W.

2. **Area Light**:
   - Mimics soft lighting.
   - Example: Adjust Size for softer shadows.

**Practice**:
- Add a Point Light and Area Light to a scene.
- Render and save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Rendering with Cycles",
          description: "Render using Cycles engine.",
          type: "TEXT",
          content: `
# Rendering with Cycles

1. **Set Engine**:
   - Properties > Render Properties > Cycles.
   - Example: Enable GPU rendering.

2. **Render Settings**:
   - Set Samples: 128 for quality.
   - Example:
     \`\`\`
     Resolution: 1920x1080
     Samples: 128
     \`\`\`

**Practice**:
- Render a scene with Cycles.
- Save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Lit Scene",
          description: "Create a lit and rendered scene.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Lit Scene

**Objective**: Design a lit scene.

**Requirements**:
- Create a scene with 2 models.
- Use 2 light types and Cycles rendering.
- Render as PNG.
- Write a 300-word report on lighting choices.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Basic Animation in Blender",
      description: "Create animations with keyframes.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Animation",
          description: "Learn animation basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Keyframing",
          description: "Animate objects with keyframes.",
          type: "TEXT",
          content: `
# Keyframing

1. **Insert Keyframe**:
   - Select object, press I > Location.
   - Example: Move cube at frame 1, keyframe.

2. **Timeline**:
   - Move to frame 40, change position, keyframe.

3. **Playback**:
   - Press Spacebar to play.

**Practice**:
- Animate a cube moving across the screen.
- Render as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Graph Editor",
          description: "Refine animations with Graph Editor.",
          type: "TEXT",
          content: `
# Graph Editor

1. **Access**:
   - Window > Graph Editor.
   - Example: Select keyframes to adjust.

2. **Ease In/Out**:
   - Modify curves for smooth motion.

**Practice**:
- Animate a sphere bouncing.
- Use Graph Editor to smooth motion.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Simple Animation",
          description: "Create a basic animation.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Simple Animation

**Objective**: Animate a scene.

**Requirements**:
- Animate a model (e.g., car moving).
- Use keyframes and Graph Editor.
- Render as MP4.
- Write a 300-word report on animation process.

**Submission**:
- Submit your Blender file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Rigging and Character Animation",
      description: "Rig and animate 3D characters.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Rigging",
          description: "Learn rigging basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating a Simple Rig",
          description: "Rig a basic character.",
          type: "TEXT",
          content: `
# Creating a Simple Rig

1. **Armature**:
   - Shift + A > Armature.
   - Example: Add bones for arm.

2. **Parenting**:
   - Parent mesh to armature (Automatic Weights).

**Practice**:
- Rig a simple arm model.
- Test bone movement.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Animating a Rig",
          description: "Animate a rigged character.",
          type: "TEXT",
          content: `
# Animating a Rig

1. **Pose Mode**:
   - Select armature, switch to Pose Mode.
   - Keyframe bone rotations.

2. **Example**:
   - Animate arm waving over 2s.

**Practice**:
- Animate a rigged arm waving.
- Render as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Character Animation",
          description: "Rig and animate a character.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Character Animation

**Objective**: Create a character animation.

**Requirements**:
- Rig a simple character (e.g., stick figure).
- Animate a 5s sequence (e.g., walk).
- Render as MP4.
- Write a 300-word report on rigging process.

**Submission**:
- Submit your Blender file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Sculpting in Blender",
      description: "Create organic models with sculpting.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Sculpting",
          description: "Learn sculpting techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Sculpting Tools",
          description: "Use sculpting brushes.",
          type: "TEXT",
          content: `
# Sculpting Tools

1. **Sculpt Mode**:
   - Select object, switch to Sculpt Mode.
   - Example: Use Draw brush.

2. **Brushes**:
   - Draw, Smooth, Inflate.
   - Example: Sculpt a sphere into a head.

**Practice**:
- Sculpt a sphere into a basic head shape.
- Save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Detailing",
          description: "Add details to sculpted models.",
          type: "TEXT",
          content: `
# Detailing

1. **Dyntopo**:
   - Enable Dynamic Topology for detail.
   - Example: Add wrinkles with Crease brush.

2. **Multires Modifier**:
   - Add for high-resolution sculpting.

**Practice**:
- Add details to a sculpted head.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Sculpted Model",
          description: "Create a sculpted model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Sculpted Model

**Objective**: Sculpt an organic model.

**Requirements**:
- Sculpt a model (e.g., creature face).
- Use 3 brushes and Dyntopo.
- Render as PNG.
- Write a 300-word report on sculpting process.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data-Driven 3D Visualizations",
      description: "Create 3D visualizations using data.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Data-Driven 3D",
          description: "Learn data-driven visualization concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Importing CSV Data",
          description: "Use CSV data for 3D models.",
          type: "TEXT",
          content: `
# Importing CSV Data

1. **Prepare CSV**:
   - Example: Sales data (region, value).
   - Save as data.csv.

2. **Python Script**:
   - Use Blender Python API.
   - Example:
     \`\`\`python
     import csv
     with open('data.csv', 'r') as f:
         reader = csv.reader(f)
         next(reader)  # Skip header
         for row in reader:
             bpy.ops.mesh.primitive_cube_add(location=(float(row[1]), 0, 0))
     \`\`\`

**Practice**:
- Import a CSV and create cubes based on data.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Dynamic Visualizations",
          description: "Create data-driven 3D visuals.",
          type: "TEXT",
          content: `
# Dynamic Visualizations

1. **Scale with Data**:
   - Use Python to scale objects.
   - Example:
     \`\`\`python
     obj.scale = (1, 1, float(row[1]))
     \`\`\`

2. **Color Mapping**:
   - Assign materials based on data.

**Practice**:
- Create a 3D bar chart from CSV data.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Visualization",
          description: "Create a data-driven 3D visualization.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Visualization

**Objective**: Visualize data in 3D.

**Requirements**:
- Use a CSV dataset (e.g., sales).
- Create a 3D visualization (e.g., bar chart).
- Render as PNG.
- Write a 300-word report on data integration.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Particle Systems and Simulations",
      description: "Create particle effects and simulations.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Particle Systems",
          description: "Learn particle system basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Particles",
          description: "Set up a particle system.",
          type: "TEXT",
          content: `
# Creating Particles

1. **Add System**:
   - Select object, Properties > Particles > New.
   - Example: Emit particles from a plane.

2. **Settings**:
   - Adjust Number, Lifetime.
   - Example:
     \`\`\`
     Number: 1000
     Lifetime: 50
     \`\`\`

**Practice**:
- Create a particle system emitting from a plane.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Physics Simulations",
          description: "Add physics to particles.",
          type: "TEXT",
          content: `
# Physics Simulations

1. **Force Fields**:
   - Shift + A > Force Field > Wind.
   - Example: Add wind to particles.

2. **Collisions**:
   - Enable collision on a mesh.

**Practice**:
- Add wind and collision to a particle system.
- Render as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Particle Effect",
          description: "Create a particle simulation.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Particle Effect

**Objective**: Design a particle effect.

**Requirements**:
- Create a particle system with force fields.
- Include a collision object.
- Render as MP4.
- Write a 300-word report on simulation process.

**Submission**:
- Submit your Blender file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Advanced Rendering Techniques",
      description: "Enhance renders with advanced techniques.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Advanced Rendering",
          description: "Learn advanced rendering methods.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "HDRI Lighting",
          description: "Use HDRI for realistic lighting.",
          type: "TEXT",
          content: `
# HDRI Lighting

1. **World Settings**:
   - Properties > World > Surface > Background.
   - Add Environment Texture node.

2. **Load HDRI**:
   - Select HDRI image (e.g., from polyhaven.com).

**Practice**:
- Set up HDRI lighting for a scene.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Compositing",
          description: "Enhance renders with compositing.",
          type: "TEXT",
          content: `
# Compositing

1. **Compositor**:
   - Window > Compositor.
   - Example: Add Glare node.

2. **Color Correction**:
   - Use Color Balance node.

**Practice**:
- Apply Glare and Color Balance to a render.
- Save as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Advanced Render",
          description: "Create an advanced render.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Advanced Render

**Objective**: Produce a high-quality render.

**Requirements**:
- Create a scene with HDRI lighting.
- Use compositing (e.g., Glare).
- Render as PNG.
- Write a 300-word report on rendering process.

**Submission**:
- Submit your Blender file, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Game Assets for Unity",
      description: "Create 3D assets for game development.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Game Assets",
          description: "Learn game asset creation.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Modeling Game Assets",
          description: "Model low-poly assets.",
          type: "TEXT",
          content: `
# Modeling Game Assets

1. **Low-Poly Modeling**:
   - Use box modeling for efficiency.
   - Example: Model a crate.

2. **Optimize**:
   - Reduce polygon count with Decimate modifier.

**Practice**:
- Model a low-poly crate.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Exporting to Unity",
          description: "Export assets for Unity.",
          type: "TEXT",
          content: `
# Exporting to Unity

1. **Export FBX**:
   - File > Export > FBX.
   - Example: Export crate model.

2. **Import to Unity**:
   - Drag FBX into Unity project.

**Practice**:
- Export a model as FBX.
- Import into Unity (optional).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Game Asset",
          description: "Create a game-ready asset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Game Asset

**Objective**: Design a game asset.

**Requirements**:
- Model a low-poly asset (e.g., weapon).
- Texture and export as FBX.
- Render as PNG.
- Write a 300-word report on asset creation.

**Submission**:
- Submit your Blender file, FBX, PNG, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: 3D Portfolio Project",
      description: "Create a professional 3D portfolio piece.",
      position: 12,
      lessons: [
        {
          title: "Planning a 3D Project",
          description: "Plan a portfolio project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Modeling and Texturing",
          description: "Model and texture your project.",
          type: "TEXT",
          content: `
# Modeling and Texturing

1. **Model**:
   - Use box modeling or sculpting.
   - Example: Model a product (e.g., phone).

2. **Texture**:
   - Apply materials and UV-mapped textures.

**Practice**:
- Model and texture a simple product.
- Render as PNG.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Animation and Rendering",
          description: "Animate and render your project.",
          type: "TEXT",
          content: `
# Animation and Rendering

1. **Animation**:
   - Keyframe a 10s animation.
   - Example: Rotate product.

2. **Rendering**:
   - Use Cycles with HDRI and compositing.

**Practice**:
- Animate and render a 10s sequence.
- Save as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: 3D Portfolio Piece",
          description: "Create a portfolio-ready 3D project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: 3D Portfolio Piece

**Objective**: Create a portfolio piece.

**Requirements**:
- Create a 3D scene (e.g., product ad, game asset).
- Include modeling, texturing, animation, rendering.
- Render as MP4 or PNG.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit your Blender file, MP4/PNG, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: 3D Portfolio",
          description: "Test your knowledge of 3D projects.",
          type: "QUIZ",
          content: `
# Quiz: 3D Portfolio

**Instructions**: Answer the following questions.

1. **What is the first step in a 3D project?**
   - A) Rendering
   - B) Planning
   - C) Texturing
   - D) Animation
   - **Answer**: B

2. **Why texture a model?**
   - A) Add realism
   - B) Reduce polygons
   - C) Simplify rigging
   - D) Speed up rendering
   - **Answer**: A

3. **What should a portfolio presentation include?**
   - **Answer**: Concept, process, final render, challenges.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
  ];

  // Create modules and lessons with error handling
  for (const moduleData of modulesData) {
    console.log(`Creating module: ${moduleData.title}`);
    try {
      const createdModule = await prisma.module.create({
        data: {
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
          courseId: course.id,
          lessons: {
            create: moduleData.lessons.map((lesson) => {
              console.log(`  Creating lesson: ${lesson.title}`);
              return {
                title: lesson.title,
                description: lesson.description,
                type: lesson.type,
                videoUrl: lesson.videoUrl || null,
                content: lesson.content || null,
                duration: lesson.duration,
                position: lesson.position,
                isPreview: lesson.isPreview,
              };
            }),
          },
        },
      });
      console.log(`Successfully created module: ${createdModule.title}`);
    } catch (error) {
      console.error(`Error creating module ${moduleData.title}:`, error);
      throw error;
    }
  }

  console.log(
    `Successfully seeded ${modulesData.length} modules and ${
      lessonPosition - 1
    } lessons for course: ${course.title}`
  );
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
  });
