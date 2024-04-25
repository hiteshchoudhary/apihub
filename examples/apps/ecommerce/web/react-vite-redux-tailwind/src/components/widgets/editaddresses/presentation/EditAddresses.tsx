import { useState } from "react";
import { AddressClass } from "../../../../services/address/AddressTypes";
import Button from "../../../basic/Button";
import AddressCardList from "../../../business/AddressCardList";
import AddIcon from "../../../icons/AddIcon";
import AddAddressModalContainer from "../../../modals/addaddressmodal/container/AddAddressModalContainer";

interface EditAddressesProps {
  addressList: AddressClass[];
  errorFetchingAddresses?: boolean;
  refetchAddresses(): void;
}
const EditAddresses = (props: EditAddressesProps) => {
  const { addressList, refetchAddresses } = props;

  /* Visibility for add address modal */
  const [isAddAdressModalShown, setIsAddAddressModalShown] = useState(false);

  /* Toggling add address modal */
  const toggleAddAddressModal = () => {
    setIsAddAddressModalShown((prev) => !prev);
  };
  
  return (
    <div className="flex flex-col">
      {isAddAdressModalShown && (
        <AddAddressModalContainer
          hideModal={toggleAddAddressModal}
          onAddressAddedOrUpdatedCallback={refetchAddresses}
        />
      )}
      <AddressCardList
        addressList={addressList}
        addressListContainerClassName="max-h-[400px] overflow-auto"
        onAddressUpdated={refetchAddresses}
        addressCardItemClassName="border "
      />

      <Button
        className="p-2 rounded-full shadow-lg w-fit self-center"
        onClickHandler={() => toggleAddAddressModal()}
      >
        <AddIcon className="w-8 h-8 text-black" />
      </Button>
    </div>
  );
};

export default EditAddresses;
