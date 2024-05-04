import { AddressClass } from "../../services/address/AddressTypes";
import AddressCard from "./AddressCard";

interface AddressCardListProps {
  addressList: AddressClass[];
  addressListContainerClassName?: string;
  addressCardItemClassName?: string;
  onAddressUpdated?(): void;
}
const AddressCardList = (props: AddressCardListProps) => {
  const {
    addressList,
    addressListContainerClassName = "",
    addressCardItemClassName,
    onAddressUpdated,
  } = props;


  return (
    <div className={`flex flex-col gap-y-4 ${addressListContainerClassName}`}>

      {addressList.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onAddressUpdated={onAddressUpdated}
          className={addressCardItemClassName}
        />
      ))}
    </div>
  );
};

export default AddressCardList;
