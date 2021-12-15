interface Node {
  label: string;
  children: Node[];
}

const ButtonDecl: Node = {
  label: 'Button',
  children: [
    {
      label: 'Prefix Slot',
      children: []
    },
  ]
}

export default ButtonDecl;
