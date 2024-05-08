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
  const styleAttributes: { [key: string]: string } = {
    ...(top && { top }),
    ...(bottom && { bottom }),
    ...(left && { left }),
    ...(right && { right }),
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: borderRadius,
  };

  return (
    <div
      className="rounded-lg p-4 absolute drop-shadow-xl"
      style={styleAttributes}
    >
      {text}
    </div>
  );
}
