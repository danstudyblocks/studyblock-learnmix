"use client";

import helpIcon from "@/public/images/get_help_icon.png";
import {
  Bodies,
  Bounds,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  World,
} from "matter-js";
import Image from "next/image";
import { useEffect } from "react";

const GetHelpToday = () => {
  function initSimulation() {
    // create an engine
    const engine = Engine.create();
    const world = engine.world;

    const containerElement = document.querySelector(
      ".tags-container"
    ) as HTMLElement;
    const containerWidth = containerElement!.clientWidth;
    const containerHeight = containerElement!.clientHeight;

    // create a renderer
    const render = Render.create({
      element: containerElement,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,

        background: "#fff",
        wireframes: false,
      },
    });

    // Add the renderer to the DOM
    Render.run(render);

    // Add bodies to the world
    // create bounds
    const ground = Bodies.rectangle(
      containerWidth / 2 + 160,
      containerHeight + 80,
      containerWidth + 320,
      160,
      { render: { fillStyle: "#fff" }, isStatic: true }
    );
    const wallLeft = Bodies.rectangle(
      -80,
      containerHeight / 2,
      160,
      containerHeight,
      { isStatic: true }
    );
    const wallRight = Bodies.rectangle(
      containerWidth + 80,
      containerHeight / 2,
      160,
      1200,
      { isStatic: true }
    );
    const roof = Bodies.rectangle(
      containerWidth / 2 + 160,
      -80,
      containerWidth + 320,
      160,
      { isStatic: true }
    );

    const radius = 20;

    // create objects

    // tagVideo & design
    const categories1 = Bodies.rectangle(
      containerWidth / 2 + 150,
      500,
      164,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/01.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories2 = Bodies.rectangle(
      containerWidth / 2 - 150,
      460,
      122,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/02.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories3 = Bodies.rectangle(
      containerWidth / 2 + 250,
      420,
      204,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/03.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories4 = Bodies.rectangle(
      containerWidth / 2 - 75,
      380,
      204,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/04.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    // video
    const categories5 = Bodies.rectangle(
      containerWidth / 2 - 74,
      540,
      194,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/05.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories6 = Bodies.rectangle(
      containerWidth / 2 + 174,
      490,
      216,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/06.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories7 = Bodies.rectangle(
      containerWidth / 2 - 142,
      440,
      167,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/07.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories8 = Bodies.rectangle(
      containerWidth / 2 - 10,
      260,
      260,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/08.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    //misc
    const categories9 = Bodies.rectangle(
      containerWidth / 2 - 242,
      420,
      174,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/09.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories10 = Bodies.rectangle(
      containerWidth / 2 + 60,
      300,
      285,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/10.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories11 = Bodies.rectangle(containerWidth / 2, 320, 170, 56, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/images/11.png",
          xScale: 1,
          yScale: 1,
        },
      },
    });
    const categories12 = Bodies.rectangle(
      containerWidth / 2 - 59,
      260,
      60,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/12.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );

    const categories13 = Bodies.rectangle(
      containerWidth / 2 + 110,
      260,
      110,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/13.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories14 = Bodies.rectangle(
      containerWidth / 2 - 110,
      296,
      201,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/14.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories15 = Bodies.rectangle(
      containerWidth / 2 - 10,
      260,
      101,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/15.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories16 = Bodies.rectangle(
      containerWidth / 2 - 80,
      260,
      201,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/16.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories17 = Bodies.rectangle(
      containerWidth / 2 - 110,
      260,
      201,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/17.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories18 = Bodies.rectangle(
      containerWidth / 2 + 90,
      260,
      201,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/18.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const categories19 = Bodies.rectangle(
      containerWidth / 2 + 80,
      260,
      201,
      56,
      {
        chamfer: { radius: radius },
        render: {
          sprite: {
            texture: "/images/19.png",
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );

    // Add created bodies to the world
    World.add(engine.world, [
      ground,
      wallLeft,
      wallRight,
      roof,
      categories1,
      categories2,
      categories3,
      categories4,
      categories5,
      categories6,
      categories7,
      categories8,
      categories9,
      categories10,
      categories11,
      categories12,
      categories13,
      categories14,
      categories15,
      categories16,
      categories17,
      categories18,
      categories19,
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });

    World.add(world, mouseConstraint);

    let click = false;

    function initSimulation() {
      if (typeof document === "undefined") return;

      if (typeof document !== "undefined") {
        document.addEventListener("mousedown", () => (click = true));
        document.addEventListener("mousemove", () => (click = false));
      }
    }

    // Create a On-Mouseup Event-Handler
    Events.on(mouseConstraint, "mouseup", function (event) {
      const mouseConstraint = event.source;
      const bodies = engine.world.bodies;
      if (!mouseConstraint) {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];

          if (click === true) {
            if (Bounds.contains(body.bounds, mouseConstraint)) {
              break;
            }
          }
        }
      }
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
  }

  useEffect(() => {
    initSimulation();
  }, []);

  return (
    <section className="stp-30">
      <div className="relative flex items-center justify-center">
        <h2 className="heading-2 relative font-bold text-n900">
          Get help <span className="text-b300 underline">Today</span>
          <Image
            src={helpIcon}
            alt=""
            className="absolute -bottom-24 right-0 z-20 sm:-bottom-20 sm:-right-28"
          />
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="tags-container relative"></div>
      </div>
    </section>
  );
};

export default GetHelpToday;
