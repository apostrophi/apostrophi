import { IconWindowDownloadFill } from "@apostrophi/icons";
import { Button, Empty } from "@apostrophi/ui";
import { getAppRouter } from "@/shared/lib/app-router";

export function DownloadsEmpty() {
  return (
    <Empty.Root>
      <Empty.Media>
        <IconWindowDownloadFill />
      </Empty.Media>
      <Empty.Title>No downloads yet</Empty.Title>
      <Empty.Description>
        Files appear here while Apostrophi downloads them for your library.
      </Empty.Description>
      <Empty.Action>
        <Button
          variant="primary"
          size="sm"
          onClick={() => getAppRouter()?.history.push("/")}
        >
          Open Library
        </Button>
      </Empty.Action>
    </Empty.Root>
  );
}
