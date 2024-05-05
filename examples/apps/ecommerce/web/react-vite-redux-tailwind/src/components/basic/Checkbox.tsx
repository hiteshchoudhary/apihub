import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CHECKBOX_TYPE } from "../../constants";
import ErrorMessage from "./ErrorMessage";

export interface CheckboxActionsRef<T> {
  forceSetCheckedItems(checkedItems: CHECKBOX_TYPE<T>[]): void;
}
interface CheckboxProps<T> {
  items: Array<CHECKBOX_TYPE<T>>;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxContainerClassName?: string;
  onChange(checkedItems: Array<CHECKBOX_TYPE<T>>): void;
  actionsRef?: CheckboxActionsRef<T>;
}
const Checkbox = React.forwardRef(
  <T,>(props: CheckboxProps<T>, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      items,
      errorMessage = "",
      labelClassName = "",
      containerClassName = "",
      checkboxContainerClassName = "",
      onChange,
      actionsRef,
    } = props;

    const {t} = useTranslation();

    const [itemsChecked, setItemsChecked] = useState<{
      items: CHECKBOX_TYPE<T>[];
      isInitialized: boolean;
    }>({ items: [], isInitialized: false });

    useEffect(() => {
      /* If default checked items are not initialized */
      if (!itemsChecked.isInitialized) {
        /*  Filter checked items from items prop */
        const defaultCheckedItems = items.filter(
          (item) => item.isDefaultSelected
        );

        /* Initialize the default values */
        setItemsChecked({ items: defaultCheckedItems, isInitialized: true });
      }
    }, [items, itemsChecked.isInitialized]);

    /* To allow parent to forcefully set checked items: For operations like reset */
    useEffect(() => {
      if (actionsRef) {
        actionsRef.forceSetCheckedItems = (
          updatedItemsState: CHECKBOX_TYPE<T>[]
        ) => {
          setItemsChecked({
            items: [...updatedItemsState],
            isInitialized: true,
          });
        };
      }
    }, [actionsRef]);

    /* When itemsChecked changes call parent function */
    useEffect(() => {
      onChange(itemsChecked.items);
    }, [itemsChecked.items, onChange]);

    /* On check / uncheck */
    const checkboxChangeHandler = (
      isChecked: boolean,
      item: CHECKBOX_TYPE<T>
    ) => {
      /* on checking an item, push it into the items checked list */
      if (isChecked) {
        setItemsChecked((prev) => {
          prev.items.push(item);
          return { items: [...prev.items], isInitialized: prev.isInitialized };
        });
      } else {
        /* Removing the item which is unchcked */
        setItemsChecked((prev) => {
          prev.items = prev.items.filter(
            (checkedItem) => checkedItem.id !== item.id
          );
          return { items: [...prev.items], isInitialized: prev.isInitialized };
        });
      }
    };

    return (
      <div className="flex flex-col">
        <div className={`${containerClassName}`}>
          {items.map((item) => (
            <div className={`${checkboxContainerClassName}`} key={item.id}>
              <input
                key={item.id}
                type="checkbox"
                checked={itemsChecked.items.includes(item)}
                onChange={(e) => checkboxChangeHandler(e.target.checked, item)}
                ref={ref}
                className=""
              />
              {item.label ? (
                <label
                  htmlFor={item.id}
                  className={`w-full cursor-pointer ${labelClassName}`}
                >
                  {item.isLabelKey ? t(item.label) : item.label}
                </label>
              ) : item.customElement ? (
                <div className="w-full">
                  {React.cloneElement(item.customElement, { data: item.data })}
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            isErrorIconShown={false}
            className="text-sm"
          />
        )}
      </div>
    );
  }
);

export default Checkbox;
