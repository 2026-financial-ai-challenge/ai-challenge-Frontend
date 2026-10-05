import { PortalChrome } from "@/components/portal/PortalChrome";
import { PortalHome } from "@/components/portal/PortalHome";

export default function PortalHomePage() {
  return (
    <PortalChrome active="온라인민원">
      <PortalHome />
    </PortalChrome>
  );
}
