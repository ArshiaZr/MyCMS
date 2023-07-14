import AlertWrapper from "@/components/AlertWrapper";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import SidebarSection from "@/components/SidebarSection";
import { AppStates } from "@/contexts/States";
import "@/styles/globals.scss";
import { useRouter } from "next/router";

export default function App({ Component, pageProps, ...appProps }) {
  const router = useRouter();

  if (
    router.pathname.split("/").includes("login") ||
    router.pathname === "/complete"
  ) {
    return (
      <AppStates>
        <AlertWrapper />
        <Component {...pageProps} />
      </AppStates>
    );
  }

  return (
    <AppStates>
      <Navbar />
      <Sidebar show={false}>
        <SidebarSection title={"Dashboard"}>
          <SidebarItem
            title="dashboard"
            icon="/icons/windowsIcon.svg"
            count={1}
            link="/"
          />
        </SidebarSection>
        <SidebarSection title={"admins"}>
          <SidebarItem
            title="admin management"
            icon="/icons/users.svg"
            count={1}
            link="/admins-management"
          />
        </SidebarSection>
        <SidebarSection title={"employees"}>
          <SidebarItem
            title="employee management"
            icon="/icons/users.svg"
            count={1}
            link="/employees-management"
          />
          <SidebarItem
            title="permissions and roles"
            icon="/icons/permission.svg"
            count={1}
            link="/permissions-and-roles"
          />
        </SidebarSection>

        <SidebarSection title={"Content Management"}>
          <SidebarItem
            title="content"
            icon="/icons/content.svg"
            count={1}
            link="/content-management"
          />
          <SidebarItem
            title="files"
            icon="/icons/files.svg"
            count={1}
            link="/image-management"
          />
        </SidebarSection>
        <SidebarSection title={"System"}>
          <SidebarItem
            title="logs"
            icon="/icons/log.svg"
            count={1}
            link="/logs"
          />
        </SidebarSection>
      </Sidebar>
      <AlertWrapper />
      <Component {...pageProps} />
    </AppStates>
  );
}
