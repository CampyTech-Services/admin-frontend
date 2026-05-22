import React from "react";

export function useDocumentTitle(title) {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}
