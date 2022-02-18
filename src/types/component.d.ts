type Component = {
    id: string;
    name: string;
    desc: string;
    properties: ComponentProperties;
    variants: ComponentVariants;
};

type ComponentProperty = {
    name: string;
    type: string;
    defaultValue: string;
    desc: string;
};

type ComponentProperties = ComponentProperty[];

type ComponentVariant = {
    name: string;
    type: string;
    defaultValue: string;
    desc: string;
};

type ComponentVariants = ComponentVariant[];

export type {
    Component,
    ComponentProperty,
    ComponentProperties,
    ComponentVariant,
    ComponentVariants,
};
