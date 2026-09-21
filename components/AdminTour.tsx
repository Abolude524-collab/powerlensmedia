"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

export const TOUR_STORAGE_KEY = "powerlens_admin_tour_seen_v2";

export function startAdminTour(currentPath: string = "/admin") {
  const isServicesPage = currentPath.startsWith("/admin/services");

  const steps: DriveStep[] = isServicesPage
    ? [
        {
          element: "#tour-admin-nav",
          popover: {
            title: "🚀 Control Room Navigation",
            description: "Easily switch back and forth between Works, Services, Client Messages, and Settings.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-services-header",
          popover: {
            title: "✨ Services Control & + Add Service",
            description: "Click '+ Add Service' to create new photography packages (e.g., Wedding, Portraits, Events).",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#tour-services-table",
          popover: {
            title: "📋 Photography Services List",
            description: "Manage service offerings, taglines, cover photos, and toggle active status live on the portfolio site.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tour-quick-links",
          popover: {
            title: "🌐 Public Site & Session Control",
            description: "Preview your live portfolio site in a new tab or safely sign out when done.",
            side: "bottom",
            align: "end",
          },
        },
      ]
    : [
        {
          element: "#tour-admin-nav",
          popover: {
            title: "🚀 Control Room Navigation",
            description: "Use these navigation links to seamlessly switch between Works, Services, Client Messages, and Settings.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-link-services",
          popover: {
            title: "✨ Photography Services Hub",
            description: "Manage photography packages (Wedding, Portraits, Events). Clicking a service's 'VIEW WORK' button links directly to filtered gallery categories!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-header-actions",
          popover: {
            title: "⚡ Quick Actions",
            description: "Add a new portfolio entry with '+ New Work', read client inquiries, or configure website settings.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#tour-stats-grid",
          popover: {
            title: "📊 Key Statistics",
            description: "Monitor your total works, published items, active drafts, and unread client messages at a glance.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-analytics-grid",
          popover: {
            title: "📈 Real-Time Telemetry",
            description: "Track live visitor metrics including gallery views, email link clicks, WhatsApp chats, and social channels.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-works-table",
          popover: {
            title: "📸 Works & Portfolio Archive",
            description: "Manage individual portfolio items. Toggle Publish/Draft status, set hero images, edit details, or delete items.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tour-quick-links",
          popover: {
            title: "🌐 Public Site & Session Control",
            description: "Preview your live public portfolio website in a new tab or safely sign out when done.",
            side: "bottom",
            align: "end",
          },
        },
      ];

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: "rgba(0, 0, 0, 0.8)",
    stagePadding: 6,
    stageRadius: 10,
    popoverClass: "powerlens-tour-popover",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got it! 🚀",
    steps,
    onDestroyed: () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        const url = new URL(window.location.href);
        if (url.searchParams.has("tour")) {
          url.searchParams.delete("tour");
          window.history.replaceState({}, "", url.toString());
        }
      }
    },
  });

  driverObj.drive();
}

export default function AdminTour() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const forceTour = urlParams.get("tour") === "true";
      const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);

      if (forceTour || !hasSeenTour) {
        const timer = setTimeout(() => {
          startAdminTour(pathname);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  return null;
}
