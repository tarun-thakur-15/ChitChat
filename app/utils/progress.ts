// utils/progress.ts
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

export const startProgress = () => {
  NProgress.start();
};
