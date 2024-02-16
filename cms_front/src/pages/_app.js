import AlertWrapper from "@/components/AlertWrapper";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import SidebarSection from "@/components/SidebarSection";
import { AppStates } from "@/contexts/States";
import "@/styles/globals.scss";
import "@/styles/fonts.css";
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
        <SidebarItem
          title="dashboard"
          icon="/icons/dashboardIconDark.svg"
          icon1="/icons/dashboardIconLight.svg"
          link="/"
        />
        <SidebarItem
          title="pages"
          icon="/icons/pagesIconPrimary.svg"
          icon1="/icons/pagesIconLight.svg"
          link="/pages-management"
        />

        <SidebarSection
          title={"employees"}
          icon="/icons/EmployeeIconPrimary.svg"
          icon1="/icons/EmployeeIconLight.svg"
        >
          <SidebarItem
            title="employee management"
            icon="/icons/EmployeeMngIconPrimary.svg"
            icon1="/icons/EmployeeMngIconLight.svg"
            link="/employees-management"
          />
          <SidebarItem
            title="permissions and roles"
            icon="/icons/permissionIconPrimary.svg"
            icon1="/icons/permissionIconLight.svg"
            link="/permissions-and-roles"
          />
        </SidebarSection>

        <SidebarSection
          title={"files"}
          icon="/icons/filesIconPrimary.svg"
          icon1="/icons/filesIconLight.svg"
        >
          <SidebarItem
            title="images"
            icon="/icons/filesIconPrimary.svg"
            icon1="/icons/filesIconLight.svg"
            link="/files-management/images"
          />
          <SidebarItem
            title="videos"
            icon="/icons/filesIconPrimary.svg"
            icon1="/icons/filesIconLight.svg"
            link="/files-management/videos"
          />
          <SidebarItem
            title="audios"
            icon="/icons/filesIconPrimary.svg"
            icon1="/icons/filesIconLight.svg"
            link="/files-management/audios"
          />
          <SidebarItem
            title="documents"
            icon="/icons/filesIconPrimary.svg"
            icon1="/icons/filesIconLight.svg"
            link="/files-management/documents"
          />
        </SidebarSection>

        <SidebarSection
          title={"System"}
          icon="/icons/windowsIcon.svg"
          icon1="/icons/windowsIcon.svg"
        >
          <SidebarItem title="logs" icon="/icons/log.svg" link="/logs" />
        </SidebarSection>
        <SidebarItem
          title="Settings"
          icon="/icons/settingsIconPrimary.svg"
          icon1="/icons/settingsIconLight.svg"
          link="/logs"
        />
      </Sidebar>
      <AlertWrapper />
      <Component {...pageProps} />
    </AppStates>
  );
}
