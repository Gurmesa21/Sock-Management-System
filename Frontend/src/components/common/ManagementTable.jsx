import { useMemo, useState } from "react";

import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";

function ManagementTable({
  title,
  description,
  actionLabel = "Add",
  columns = [],
  data = [],
  searchFields = [],
  searchPlaceholder = "Search...",
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return data;
    }

    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field] ?? "")
          .toLowerCase()
          .includes(value)
      )
    );
  }, [data, search, searchFields]);

  return (
    <div className="master-page">

      <PageHeader
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={() => {
          console.log(`Add ${title}`);
        }}
      />

      <div className="toolbar">

        <div className="toolbar-left">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
          />

        </div>

      </div>

      <div className="data-card">

        {filteredData.length === 0 ? (

          <EmptyState
            title={`No ${title.toLowerCase()} found`}
            message="Try changing your search."
          />

        ) : (

          <div className="data-table-wrapper">

            <table className="data-table">

              <thead>
                <tr>

                  {columns.map((column) => (
                    <th key={column.key}>
                      {column.label}
                    </th>
                  ))}

                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {filteredData.map((item) => (

                  <tr key={item.id}>

                    {columns.map((column) => (
                      <td key={column.key}>
                        {item[column.key]}
                      </td>
                    ))}

                    <td>

                      <div className="action-buttons">

                        <button
                          className="table-action"
                          type="button"
                        >
                          View
                        </button>

                        <button
                          className="table-action"
                          type="button"
                        >
                          Edit
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default ManagementTable;