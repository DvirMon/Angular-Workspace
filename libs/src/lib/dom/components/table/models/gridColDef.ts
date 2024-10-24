import { GridColType } from './gridColType';
import { GridRowId, GridValidRowModel } from './gridRows';
import { GridComparatorFn, GridSortDirection } from './gridSortModel';
/**
 * Alignment used in position elements in Cells.
 */
export type GridAlignment = 'left' | 'right' | 'center';

export type ValueOptions =
  | string
  | number
  | {
      value: unknown;
      label: string;
    }
  | Record<string, unknown>;

export type GridKeyValue = string | number | boolean;

export type GridValueGetter<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V,
  TValue = never
> = (value: TValue, row: R, column: GridColDef<R, V, F>) => V;

export type GridValueFormatter<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V,
  TValue = never
> = (value: TValue, row: R, column: GridColDef<R, V, F>) => F;

export type GridValueSetter<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V
> = (value: V, row: R, column: GridColDef<R, V, F>) => R;

export type GridValueParser<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V
> = (
  value: F | undefined,
  row: R | undefined,
  column: GridColDef<R, V, F>
) => V;

export type GridColSpanFn<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V
> = (value: V, row: R, column: GridColDef<R, V, F>) => number | undefined;
/**
 * Column Definition base interface.
 */
export interface GridBaseColDef<
  R extends GridValidRowModel = GridValidRowModel,
  V = unknown,
  F = V
> {
  /**
   * The column identifier. It's used to map with [[GridRowModel]] values.
   */
  field: string;
  /**
   * The title of the column rendered in the column header cell.
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed.
   */
  description?: string;
  /**
   * Set the width of the column.
   * @default 100
   */
  width?: number;
  /**
   * If set, it indicates that a column has fluid width. Range [0, ∞).
   */
  flex?: number;
  /**
   * Sets the minimum width of a column.
   * @default 50
   */
  minWidth?: number;
  /**
   * Sets the maximum width of a column.
   * @default Infinity
   */
  maxWidth?: number;
  /**
   * If `false`, removes the buttons for hiding this column.
   * @default true
   */
  hideable?: boolean;
  /**
   * If `true`, the column is sortable.
   * @default true
   */
  sortable?: boolean;
  /**
   * The order of the sorting sequence.
   */
  sortingOrder?: GridSortDirection[];
  /**
   * If `true`, the column is resizable.
   * @default true
   */
  resizable?: boolean;
  /**
   * If `true`, the cells of the column are editable.
   * @default false
   */
  editable?: boolean;
  /**
   * If `true`, the rows can be grouped based on this column values (pro-plan only).
   * Only available in DataGridPremium.
   * TODO: Use module augmentation to move it to `@mui/x-data-grid-premium` (need to modify how we handle column types default values).
   * @default true
   */
  groupable?: boolean;
  /**
   * If `false`, the menu items for column pinning menu will not be rendered.
   * Only available in DataGridPro.
   * TODO: Use module augmentation to move it to `@mui/x-data-grid-pro` (need to modify how we handle column types default values).
   * @default true
   */
  pinnable?: boolean;
  /**
   * A comparator function used to sort rows.
   */
  sortComparator?: GridComparatorFn<V>;
  /**
   * Allows to use a different comparator function depending on the sort direction.
   * Takes precedence over `sortComparator`.
   * @param {GridSortDirection} sortDirection The direction of the sort.
   * @returns {GridComparatorFn<V>} The comparator function to use.
   */
  getSortComparator?: (
    sortDirection: GridSortDirection
  ) => GridComparatorFn<V> | undefined;
  /**
   * The type of the column.
   * @default 'string'
   * @see See {@link https://mui.com/x/react-data-grid/column-definition/#column-types column types docs} for more details.
   */
  type?: GridColType;
  /**
   * Allows to align the column values in cells.
   */
  align?: GridAlignment;
  /**
   * Function that allows to get a specific data instead of field to render in the cell.
   */
  valueGetter?: GridValueGetter<R, V, F>;
  /**
   * Function that allows to customize how the entered value is stored in the row.
   * It only works with cell/row editing.
   * @returns {R} The row with the updated field.
   */
  valueSetter?: GridValueSetter<R, V, F>;
  /**
   * Function that allows to apply a formatter before rendering its value.
   */
  valueFormatter?: GridValueFormatter<R, V, F>;
  /**
   * Function that takes the user-entered value and converts it to a value used internally.
   * @returns {V} The converted value to use internally.
   */
  valueParser?: GridValueParser<R, V, F>;
  /**
   * Class name that will be added in cells for that column.
   */
  cellClassName?: string;
  /**
   * Display mode for the cell:
   *  - 'text': For text-based cells (default)
   *  - 'flex': For cells with HTMLElement children
   */
  display?: 'text' | 'flex';

  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName?: string;
  /**
   * Header cell element alignment.
   */
  headerAlign?: GridAlignment;
  /**
   * Toggle the visibility of the sort icons.
   * @default false
   */
  hideSortIcons?: boolean;
  /**
   * If `true`, the column menu is disabled for this column.
   * @default false
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, the column is filterable.
   * @default true
   */
  filterable?: boolean;

  /**
   * If `true`, this column will not be included in exports.
   * @default false
   */
  disableExport?: boolean;
  /**
   * Number of columns a cell should span.
   * @default 1
   */
  colSpan?: number | GridColSpanFn<R, V, F>;
}
/**
 * Column Definition interface used for columns with the `actions` type.
 * @demos
 *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
 */
export interface GridActionsColDef<
  R extends GridValidRowModel = { [key: string]: unknown },
  V = unknown,
  F = V
> extends GridBaseColDef<R, V, F> {
  /**
   * The type of the column.
   * @default 'actions'
   */
  type: 'actions';

  // getActions: (
  //   params: GridRowParams<R>
  // ) => React.ReactElement<GridActionsCellItemProps>[];
}
/**
 * Column Definition interface used for columns with the `singleSelect` type.
 * @demos
 *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
 */
export interface GridSingleSelectColDef<
  R extends GridValidRowModel = { [key: string]: unknown },
  V = unknown,
  F = V
> extends GridBaseColDef<R, V, F> {
  /**
   * The type of the column.
   * @default 'singleSelect'
   */
  type: 'singleSelect';
  /**
   * To be used in combination with `type: 'singleSelect'`. This is an array
   * (or a function returning an array) of the possible cell values and labels.
   */
  valueOptions?:
    | Array<ValueOptions>
    | ((params: GridValueOptionsParams<R>) => Array<ValueOptions>);
  /**
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel?: (value: ValueOptions) => string;
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue?: (value: ValueOptions) => unknown;
}
/**
 * Column Definition interface.
 * @demos
 *   - [Column definition](/x/react-data-grid/column-definition/)
 */
export type GridColDef<
  R extends GridValidRowModel = { [key: string]: unknown },
  V = unknown,
  F = V
> =
  | GridBaseColDef<R, V, F>
  | GridActionsColDef<R, V, F>
  | GridSingleSelectColDef<R, V, F>;
export type GridColTypeDef<V = unknown, F = V> = Omit<
  GridBaseColDef<{ [key: string]: unknown }, V, F>,
  'field'
>;

export interface GridValueOptionsParams<
  R extends GridValidRowModel = { [key: string]: unknown }
> {
  /**
   * The field of the column to which options will be provided
   */
  field: string;
  /**
   * The grid row id.
   */
  id?: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row?: R;
}
