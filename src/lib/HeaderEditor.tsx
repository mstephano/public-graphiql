import * as React from "react";
import {
  headersObjectToArray,
  headersArrayToObject,
  edited2DArray,
} from "./utils";
import { IconCross, IconEye } from "./Icons";

export default function HeaderEditor({
  initialHeaders,
  hiddenHeaders = [],
  onUpdate,
}: {
  initialHeaders: Record<string, string>;
  hiddenHeaders?: string[];
  onUpdate: (headers: Record<string, string>) => void;
}) {
  const [{ headerArray, updateRequired }, setData] = React.useState({
    headerArray: headersObjectToArray(initialHeaders, hiddenHeaders).concat([
      [true, "", "", false],
    ]),
    updateRequired: false,
  });

  function updateIfRequired() {
    if (updateRequired) {
      onUpdate(headersArrayToObject(headerArray));
      setData({ headerArray: headerArray, updateRequired: false });
    }
  }

  return (
    <table className="hasura-graphiql-table">
      <thead>
        <tr className="hasura-graphiql-table-header-row">
          <th className="hasura-graphiql-table-header-col-1">Enable</th>
          <th className="hasura-graphiql-table-header-col-2">Key</th>
          <th className="hasura-graphiql-table-header-col-2">Value</th>
          <th className="hasura-graphiql-table-header-col-1"></th>
        </tr>
      </thead>
      <tbody style={{ backgroundColor: "#fff" }}>
        {headerArray.map((header, i) => (
          <tr key={"row" + i}>
            <td style={{ textAlign: "center", backgroundColor: "#fff" }}>
              <input
                type="checkbox"
                onChange={(e) => {
                  let res = edited2DArray(headerArray, i, 0, e.target.checked);
                  onUpdate(headersArrayToObject(res));
                  setData(()=>({ headerArray: res, updateRequired: false }));
                }}
                className="hasura-graphiql-table-checkbox"
                checked={header[0]}
              />
            </td>
            <td
              className="hasura-graphiql-table-cell"
              style={{ borderRight: "thin solid rgb(229, 231, 235)" }}
            >
              <input
                onBlur={updateIfRequired}
                onChange={(e) => {
                  let edited = edited2DArray(headerArray, i, 1, e.target.value);
                  edited = edited2DArray(
                    edited,
                    i,
                    3,
                    hiddenHeaders.includes(e.target.value)
                  );
                  if (i === headerArray.length - 1)
                    // add blank row below
                    edited.push([true, "", "", false]);
                  setData({ headerArray: edited, updateRequired: true });
                }}
                className="hasura-graphiql-table-input"
                placeholder="Enter Key"
                type="text"
                data-testid={`row-key-${i}`}
                value={header[1]}
              />
            </td>
            <td colSpan={1} className="hasura-graphiql-table-cell">
              <input
                onBlur={updateIfRequired}
                onChange={(e) => {
                  let edited = edited2DArray(headerArray, i, 2, e.target.value);
                  if (i === headerArray.length - 1)
                    // add blank row
                    edited.push([true, "", "", false]);
                  setData({ headerArray: edited, updateRequired: true });
                }}
                className="hasura-graphiql-table-input"
                placeholder="Enter Value"
                data-testid={`row-value-${i}`}
                type={header[3] ? "password" : "text"}
                value={header[2]}
              />
            </td>
            <td className="hasura-graphiql-table-cell-cross">
              {hiddenHeaders.includes(header[1]) && i < headerArray.length - 1 && (
                <span
                  style={{ marginRight: "1em", cursor: "pointer" }}
                  onClick={() => {
                    let toggled = !header[3];
                    setData({
                      headerArray: edited2DArray(headerArray, i, 3, toggled),
                      updateRequired: false,
                    });
                  }}
                >
                  <IconEye />
                </span>
              )}
              {i < headerArray.length - 1 && (
                <i
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let result = headerArray.slice();
                    result.splice(i, 1);
                    onUpdate(headersArrayToObject(result));
                    setData({ headerArray: result, updateRequired: false });
                  }}
                >
                  <IconCross />
                </i>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
