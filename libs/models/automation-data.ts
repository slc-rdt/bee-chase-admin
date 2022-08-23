export default interface AutomationData {
  message?: string; // AutomationType is NOTIFY_ALL_USERS
  mission_ids?: string[]; // AutomationType is not NOTIFY_ALL_USERS
}
