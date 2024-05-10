import { Button, Link } from "@nextui-org/react";
import React from "react";

export default function Page() {
  return (
    <div className="flex justify-center items-center flex-col gap-4 h-screen">
      <div className="items-center flex flex-col">
        <h1 className="text-6xl font-semibold ">403</h1>
        <p className="font-medium text-default-900">
          Voice authorization required
        </p>
      </div>
      <Button color="primary" showAnchorIcon variant="solid" as={Link} href="/">
        Go Back
      </Button>
    </div>
  );
}
