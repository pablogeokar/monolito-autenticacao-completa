import { UAParser } from "ua-parser-js";
import { format, formatDistanceToNowStrict, isPast } from "date-fns";
import { Laptop, Smartphone, type LucideIcon } from "lucide-react";

//type DeviceType = "desktop" | "mobile";

interface AgentType {
  deviceType: string;
  browser: string;
  os: string;
  timeAgo: string;
  icon: LucideIcon;
}

export const parseUserAgent = (
  userAgent: string,
  createdAt: string
): AgentType => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceType = result.device.type || "Desktop";
  const browser = result.browser.name || "Web";
  const os = `${result.os.name} ${result.os.version}`;
  const icon = deviceType === "mobile" ? Smartphone : Laptop;

  const formattedAt = isPast(new Date(createdAt))
    ? `${formatDistanceToNowStrict(new Date(createdAt))}`
    : `${format(new Date(createdAt), "d MMM, yyyy")}`;

  return { deviceType, browser, os, icon, timeAgo: formattedAt } as AgentType;
};
