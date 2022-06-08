import * as admin from "firebase-admin";
import { FirebaseAdmin, FirebaseModuleOptions } from "../firebase.interface";

const createInstances = (app: admin.app.App): FirebaseAdmin => ({
  auth: app.auth(),
  messaging: app.messaging(),
  db: app.firestore(),
  storage: app.storage(),
});

const getOrInitApp = (
  opt: admin.AppOptions | undefined,
  name: string | undefined
): admin.app.App => {
  try {
    return admin.app(name);
  } catch (err: any) {
    if (err && err.code === "app/no-app") {
      admin.initializeApp(opt, name);
    }
  }
  return admin.app(name);
};

export const getFirebaseAdmin = (
  options?: FirebaseModuleOptions
): FirebaseAdmin => {
  const name = (options && options.name) || undefined;
  if (!options || Object.values(options).filter((v) => !!v).length === 0) {
    return createInstances(getOrInitApp(undefined, name));
  }
  const { googleApplicationCredential: serviceAccountPath, ...appOptions } =
    options;
  return createInstances(
    getOrInitApp(
      {
        credential: serviceAccountPath
          ? admin.credential.cert(serviceAccountPath)
          : undefined,
        ...appOptions,
      },
      name
    )
  );
};
