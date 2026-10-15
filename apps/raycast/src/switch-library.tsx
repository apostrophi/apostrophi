import {
  Action,
  ActionPanel,
  closeMainWindow,
  Icon,
  List,
  open,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import {
  type ApostrophiLibrary,
  listRecentLibraries,
  switchLibrary,
} from "./apostrophi-api";

export default function SwitchLibrary() {
  const [libraries, setLibraries] = useState<ApostrophiLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    void listRecentLibraries()
      .then(setLibraries)
      .catch((error) =>
        setFailure(
          error instanceof Error
            ? error.message
            : "Try again with Apostrophi open.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  async function openLibrary(library: ApostrophiLibrary) {
    if (library.active) {
      await open("apostrophi://library");
      await closeMainWindow();
      return;
    }
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Switching Library",
      message: library.name,
    });
    try {
      await switchLibrary(library.path);
      toast.style = Toast.Style.Success;
      toast.title = "Library Switched";
      await closeMainWindow();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Could Not Switch Library";
      toast.message =
        error instanceof Error
          ? error.message
          : "Try again with Apostrophi open.";
    }
  }

  return (
    <List isLoading={loading} searchBarPlaceholder="Search Libraries…">
      {libraries.length === 0 ? (
        <List.EmptyView
          icon={failure ? Icon.ExclamationMark : Icon.Folder}
          title={failure ? "Could Not Reach Apostrophi" : "No Recent Libraries"}
          description={failure ?? "Open another Library in Apostrophi first."}
        />
      ) : (
        libraries.map((library) => (
          <List.Item
            key={library.path}
            icon={library.icon ?? Icon.Folder}
            title={library.name}
            subtitle={library.path}
            keywords={[library.path]}
            accessories={
              library.active
                ? [
                    {
                      tag: {
                        value: "Open",
                        color: library.accent ?? undefined,
                      },
                    },
                  ]
                : library.available
                  ? []
                  : [{ tag: "Missing" }]
            }
            actions={
              <ActionPanel>
                {library.available ? (
                  <>
                    <Action
                      title={
                        library.active ? "Show Apostrophi" : "Switch Library"
                      }
                      icon={library.active ? Icon.AppWindow : Icon.ArrowRight}
                      onAction={() => void openLibrary(library)}
                    />
                    <Action.ShowInFinder path={library.path} />
                  </>
                ) : null}
                <Action.CopyToClipboard
                  title="Copy Library Path"
                  content={library.path}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
