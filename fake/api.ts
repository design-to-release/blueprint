import type { Component } from "../src/types/component.d.ts";

import { serve } from "https://deno.land/std@0.125.0/http/server.ts";
import { Node } from "https://deno.land/x/router@v2.0.1/mod.ts";

const { readFile, writeTextFile } = Deno;
const decoder = new TextDecoder();

type Req<Params = undefined, Body = undefined> = {
    params: Params;
    body: Promise<Body>;
};

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

function jsonResponse(s: string, init: ResponseInit = {}): Response {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    init.headers = headers;

    return new Response(s, init);
}

function findComponentPathById(id: string): string {
    return `./data/components/${id}.json`;
}

const routes = new Node();
routes.add("/@GET/api/groups", async () => {
    const buf = await readFile("./data/groups.json");
    return jsonResponse(decoder.decode(buf));
});

routes.add("/@GET/api/components/:id", async (req: Req<{ id: string }>) => {
    const buf = await readFile(findComponentPathById(req.params.id));
    // await sleep(2000);
    return jsonResponse(decoder.decode(buf));
});

routes.add(
    "/@PATCH/api/components/:id",
    async (req: Req<{ id: string }, Partial<Component>>) => {
        const componentPath = findComponentPathById(req.params.id);
        const buf = await readFile(componentPath);
        const orig: Component = JSON.parse(decoder.decode(buf));
        const patch = await req.body;
        for (const key in orig) {
            // @ts-ignore fuck
            if (patch[key]) orig[key] = patch[key];
        }
        const updateded = JSON.stringify(orig, undefined, 4);
        await writeTextFile(componentPath, updateded);
        return jsonResponse(JSON.stringify(orig));
    }
);

serve(
    (req) => {
        const url = new URL(req.url);

        const [h, p] = routes.find(`/@${req.method}${url.pathname}`);
        console.log(url.pathname, req.method, p);

        if (h) {
            const _req: Record<string, unknown> = {
                params: Object.fromEntries(p),
            };
            if (req.body) {
                if (req.headers.get("Content-Type") === "application/json") {
                    _req["body"] = req.json();
                }
            }
            return h(_req);
        }

        return new Response("Not Found");
    },
    { port: 3001 }
);
