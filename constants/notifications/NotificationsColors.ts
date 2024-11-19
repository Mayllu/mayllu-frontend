import { Colors } from "../Colors";
import { NotificationsCategories as NC } from "./NotificationsCategories";

export const NotificationColors = {
  [NC.REPORT_NEW]: Colors.blue_60,
  [NC.REPORT_RESOLVED]: Colors.green_60,
  [NC.REPORT_APPROVED]: Colors.purple_60,
  [NC.REPORT_REJECTED]: Colors.red_60,
  default: Colors.yellow_60,
};
