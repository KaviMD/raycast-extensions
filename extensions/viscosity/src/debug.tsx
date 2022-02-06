import { List, Icon } from "@raycast/api";
export default function Command() {
  return (
    <List>
      {getAllIcons().map((icon, index) => (
        <List.Item title={`${icon}`} icon={{ source: icon }} key={index} />
      ))}
    </List>
  );
}

function getAllIcons() {
  const icons: Icon[] = [];

  for (const i in Icon) {
    icons.push(Icon[i]);
  }

  return icons;
}
