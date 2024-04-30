export default function ChatBox({
  text,
  bgColor,
  textColor,
  borderRadius,
  top,
  bottom,
  left,
  right,
}: {
  text: string;
  bgColor: string;
  textColor: string;
  borderRadius: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}) {
  const styleAttributes: { [key: string]: string } = {};
  if (top) styleAttributes.top = top;
  if (bottom) styleAttributes.bottom = bottom;
  if (left) styleAttributes.left = left;
  if (right) styleAttributes.right = right;

  styleAttributes.backgroundColor = bgColor;
  styleAttributes.color = textColor;
  styleAttributes['border-radius'] = borderRadius;

  return (
    <div
      className="rounded-lg p-4 absolute drop-shadow-xl"
      style={styleAttributes}
    >
      {text}
    </div>
  );
}
