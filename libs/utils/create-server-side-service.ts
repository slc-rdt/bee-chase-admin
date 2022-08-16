import { GetServerSidePropsContext, NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

type Req = GetServerSidePropsContext["req"] | NextRequest | NextApiRequest;

interface CanBeInstantiated<T> {
  new (accessToken?: string): T;
}

export default async function createServerSideService<T>(
  req: Req,
  serviceType: CanBeInstantiated<T>
) {
  const token = await getToken({ req });
  return new serviceType(token?.user.access_token) as T;
}
