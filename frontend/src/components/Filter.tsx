export default function filterFunction(
  filter: string | undefined,
  context: CanvasFilters
) {
  if (filter == "grayscale(100%)") {
    context.filter = "grayscale(100%)";
  }
  if (filter == "hue-rotate(90deg)") {
    context.filter = "hue-rotate(90deg)";
  }
  if (filter == "old") {
    context.filter = "grayscale(1) sepia(0.5) brightness(1.3) invert(0.8);";
  }
  if (filter == "low_fi") {
    context.filter = "saturate(1.1) contrast(1.5)";
  }
}
