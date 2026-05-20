import PublicBookingClient from "./booking-client";

export default async function PublicBookingPage(props: PageProps<"/b/[slug]">) {
  const { slug } = await props.params;
  return <PublicBookingClient slug={slug} />;
}
