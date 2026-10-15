import { IconNodes3Fill } from "@apostrophi/icons";
import { Button, Empty } from "@apostrophi/ui";
import { useState } from "react";
import { sourceNewMenu } from "@/features/sources/state/source-new-menu";
import { BrowserExtensionDialog } from "@/shared/components/browser-extension-dialog";

export function SourcesEmpty() {
  const [extensionOpen, setExtensionOpen] = useState(false);
  return (
    <Empty.Root>
      <Empty.Media>
        <IconNodes3Fill />
      </Empty.Media>
      <Empty.Title>No sources yet</Empty.Title>
      <Empty.Description>
        Connect an account or watch a public one to keep Apostrophi in sync.
        Connecting an account needs the Apostrophi browser extension.
      </Empty.Description>
      <Empty.Action>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setExtensionOpen(true)}
        >
          Get Extension
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => sourceNewMenu.open()}
        >
          New Source
        </Button>
      </Empty.Action>
      <BrowserExtensionDialog
        open={extensionOpen}
        onOpenChange={setExtensionOpen}
      />
    </Empty.Root>
  );
}
