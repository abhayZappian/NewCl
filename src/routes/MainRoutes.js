import MainLayout from "layout/MainLayout";
import ReactEmailFlow from "views/react-email-flow/ReactEmailFlow";
import { CampaignJourneyDashboard } from "views/campaign-journey-list/CampaignJourneyDashboard";
import { Login } from "views/login";
import ProtectedRoute from "./ProtectedRoute";
import CallbackHandlerPage from "views/login/callbackHandler";
import Logout from "views/logout";
import EmailStats from "../views/dashboard/components/EmailStats";
import Leads from "views/dashboard/components/Leads";
import AllJourneyStats from "views/dashboard/components/AllJourneyStats";
import List from "views/data-management/list/index";
import Segment from "views/data-management/segment";
import Supression from "views/data-management/supression";
import SearchEmail from "views/data-management/search";
import Editor from "views/editor/Editor";
import Vertical from "views/Presets/vertical/index";
import Template from "views/Presets/template/index";
import Subvertical from "views/Presets/sub-vertical";
import Offer from "views/Presets/offer";
import Network from "views/Presets/network";
import HeaderPreset from "views/Presets/header";
import FooterPreset from "views/Presets/footer";
import Pool from "../views/Presets/pool/index";
import Unsubscribe from "../views/unsubscribe/index";
import Domain from "../views/admin-console/domain/index";
import ESP from "../views/admin-console/esp/index";
import QuickCampaign from "views/quick-campaign/index";
import EspIspCAP from "../views/global-setting/esp/index";
import UserLevelCap from "../views/global-setting/user-level-cap/index";
import BounceTreatment from "../views/global-setting/bounce-treatment/index";
import EspCommitment from "../views/global-setting/esp-commitment/index";
import NotificationSetting from "../views/global-setting/notification-setting/index";
import Disaster from "../views/global-setting/disaster/index";
import ImageHosting from "../views/image-hosting/Components/table";
import DomainTable from "../views/historical-data/domain/index";
import IpTable from "../views/historical-data/ip/index";
import CreativeNetworkTable from "../views/creative-compliance/network-list/index";
import NetworkComplaince from "../views/creative-compliance/add-complaince/index";
import CreativeComplaince from "../views/creative-compliance/creative-compliance/index";
import SentenceSuggestion from "../views/creative-compliance/sentence-suggestion/index"
import Checker from "../views/creative-compliance/from-subject-checker/index";

// sample page routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: "/",

    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <CampaignJourneyDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/email-flow",
        element: (
          <ProtectedRoute>
            <ReactEmailFlow />
          </ProtectedRoute>
        ),
      },
      {
        path: "/react-email-flow",
        element: (
          <ProtectedRoute>
            <ReactEmailFlow />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaign-stats",
        element: (
          <ProtectedRoute>
            <EmailStats />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaignLeads/:id",
        element: (
          <ProtectedRoute>
            <AllJourneyStats />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-journey-stats",
        element: (
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/data-management/list",
        element: (
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        ),
      },
      {
        path: "/data-management/segment",
        element: (
          <ProtectedRoute>
            <Segment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/data-management/supression",
        element: (
          <ProtectedRoute>
            <Supression />
          </ProtectedRoute>
        ),
      },
      {
        path: "/data-management/search-email",
        element: (
          <ProtectedRoute>
            <SearchEmail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/email-template-editor",
        element: (
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        ),
      },
      {
        path: "/presets/vertical",
        element: (
          <ProtectedRoute>
            <Vertical />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/template",
        element: (
          <ProtectedRoute>
            <Template />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/sub-vertical",
        element: (
          <ProtectedRoute>
            <Subvertical />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/offer",
        element: (
          <ProtectedRoute>
            <Offer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/network",
        element: (
          <ProtectedRoute>
            <Network />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/header",
        element: (
          <ProtectedRoute>
            <HeaderPreset />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/footer",
        element: (
          <ProtectedRoute>
            <FooterPreset />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Presets/pool",
        element: (
          <ProtectedRoute>
            <Pool />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-console/domain",
        element: (
          <ProtectedRoute>
            <Domain />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-console/esp-accounts",
        element: (
          <ProtectedRoute>
            <ESP />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quick-campaign",
        element: (
          <ProtectedRoute>
            <QuickCampaign />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/esp",
        element: (
          <ProtectedRoute>
            <EspIspCAP />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/user-level-cap",
        element: (
          <ProtectedRoute>
            <UserLevelCap />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/bounce-treatment",
        element: (
          <ProtectedRoute>
            <BounceTreatment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/esp-commitment",
        element: (
          <ProtectedRoute>
            <EspCommitment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/notification-setting",
        element: (
          <ProtectedRoute>
            <NotificationSetting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/global-settings/disaster-and-action",
        element: (
          <ProtectedRoute>
            <Disaster />
          </ProtectedRoute>
        ),
      },
      {
        path: "/image-hosting",
        element: (
          <ProtectedRoute>
            <ImageHosting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/domain-details",
        element: (
          <ProtectedRoute>
            <DomainTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ip-historical-data",
        element: (
          <ProtectedRoute>
            <IpTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/creative/network-list",
        element: (
          <ProtectedRoute>
            <CreativeNetworkTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/creative/network-complaince",
        element: (
          <ProtectedRoute>
            <NetworkComplaince />
          </ProtectedRoute>
        ),
      },
      {
        path: "/creative/creative-complaince",
        element: (
          <ProtectedRoute>
            <CreativeComplaince />
          </ProtectedRoute>
        ),
      },
      ///
      {
        path: "/creative/sentence-suggestion",
        element: (
          <ProtectedRoute>
            <SentenceSuggestion/>
          </ProtectedRoute>
        ),
      },
      ///
      {
        path: "/creative/from-and-subject-checker",
        element: (
          <ProtectedRoute>
            <Checker />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unsubscribe",
    element: <Unsubscribe />,
  },
  {
    path: "/callback",
    element: <CallbackHandlerPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
];

export default MainRoutes;
