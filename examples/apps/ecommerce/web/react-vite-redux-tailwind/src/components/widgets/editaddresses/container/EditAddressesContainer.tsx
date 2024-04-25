import { useCallback, useEffect, useState } from "react";
import AddressService from "../../../../services/address/AddressService";
import { AddressClass } from "../../../../services/address/AddressTypes";
import EditAddresses from "../presentation/EditAddresses";
import ErrorMessage from "../../../basic/ErrorMessage";
import { useTranslation } from "react-i18next";

const EditAddressesContainer = () => {
  const { t } = useTranslation();

  /* User's addresses */
  const [addressList, setAddressList] = useState<AddressClass[]>([]);

  /* For error while fetching addresses */
  const [errorFetchingAddresses, setErrorFetchingAddresses] = useState(false);

  const fetchAddresses = useCallback(() => {
    /* Resetting address list */
    setAddressList([]);

    /* Hiding the error message */
    setErrorFetchingAddresses(false);

    AddressService.getAllAddressesAsync((data, _, error) => {
      if (!error) {
        /* Appending items to address list state */
        setAddressList((prev) => [...prev, ...data]);
      } else {
        /* In case of error, showing the error message */
        setErrorFetchingAddresses(true);
      }
    });
  }, []);

  /* Initial Render */
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <>
      {errorFetchingAddresses ? (
        <ErrorMessage message={t("failedToFetchInformation")} />
      ) : (
        <EditAddresses
          addressList={addressList}
          refetchAddresses={fetchAddresses}
          errorFetchingAddresses={errorFetchingAddresses}
        />
      )}
    </>
  );
};

export default EditAddressesContainer;
