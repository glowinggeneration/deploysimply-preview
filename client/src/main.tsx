/*
 * DeploySimply preview mount.
 * Design language: preserve the uploaded SMAIT interface as the visual ground truth
 * so the first browser pass can focus on UI/UX review before any redesign work.
 */
import "./smait.css";
import "./index.css";

const imageAssets = {
  expert: "/manus-storage/expert_e7109dda.png",
  challenger: "/manus-storage/challenger_f9682e4d.png",
  hype: "/manus-storage/hype_4f52ca60.png",
  group: "/manus-storage/group_6baf39ce.png",
};

const globalWindow = window as typeof window & {
  __SMAIT_INIT__?: boolean;
  __SMAIT_IMG__?: typeof imageAssets;
};

globalWindow.__SMAIT_IMG__ = imageAssets;

// The uploaded site is intentionally mounted as its original lightweight SPA.
// It owns the #root node and handles its own client-side navigation.
// @ts-expect-error - the uploaded runtime is a standalone JavaScript SPA without declarations.
void import("./smait-app.js");
