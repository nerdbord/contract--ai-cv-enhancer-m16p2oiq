import { clerk } from "../lib/clerk";
import { prisma } from "../lib/prisma";

export async function createUserFromClerk(clerkUserId: string) {
  try {
    // Fetch user data from Clerk
    const clerkUser = await clerk.users.getUser(clerkUserId);

    if (!clerkUser) {
      console.error(`No Clerk user found with ID: ${clerkUserId}`);
      throw new Error("Clerk user not found.");
    }

    // Extract email and name from Clerk user object
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";
    const name =
      firstName && lastName
        ? `${firstName} ${lastName}`
        : firstName || lastName || "No name provided";

    // Validation to ensure email is present
    if (!email) {
      throw new Error("No email address available for this Clerk user.");
    }

    // Upsert user into the Prisma database
    const user = await prisma.user.upsert({
      where: { clerkId: clerkUserId },
      update: {
        name,
        email,
      },
      create: {
        email,
        clerkId: clerkUserId,
        name,
      },
    });

    console.log("User successfully created or updated from Clerk:", user);
    return user;
  } catch (error) {
    console.error("Error creating/updating user from Clerk:", error);
    throw new Error("Unable to create or update user.");
  }
}
/* 
export async function getUserByClerkId(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    console.log(`User with Clerk ID: ${clerkUserId} not found.`);
    return null;
  }

  //console.log("User found:", user);
  return user;
}
 */
