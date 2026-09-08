import {
  Atom,
  BookOpen,
  Circle,
  Cpu,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  type LucideIcon,
  type LucideProps,
  Palette,
  Scale,
  Sigma,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  atom: Atom,
  "book-open": BookOpen,
  cpu: Cpu,
  "flask-conical": FlaskConical,
  globe: Globe,
  landmark: Landmark,
  languages: Languages,
  leaf: Leaf,
  palette: Palette,
  scale: Scale,
  sigma: Sigma,
};

type SubjectIconProps = LucideProps & {
  name: string;
};

export function SubjectIcon({ name, ...props }: SubjectIconProps) {
  const Icon = ICONS[name] ?? Circle;
  return <Icon {...props} />;
}
