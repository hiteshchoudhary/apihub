import { useCallback, useEffect, useReducer, useState } from "react";
import { COUNTRIES_DROPDOWN_LIST } from "../../../../data/applicationData";
import AddAddressModal from "../presentation/AddAddressModal";
import {
  ADDRESS_FORM_KEYS,
  AddressFormFields,
  DropdownItem,
} from "../../../../constants";
import CountryApiService from "../../../../services/countryapi/CountryApiService";
import ApiError from "../../../../services/ApiError";
import AddressService from "../../../../services/address/AddressService";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import { useTranslation } from "react-i18next";
import { AddressClass } from "../../../../services/address/AddressTypes";

interface DropdownListActions  {
  type:
    | "FETCHING"
    | "UPDATE_CITIES"
    | "UPDATE_STATES"
    | "UPDATE_LOADING_STATUS"
    | "UPDATE_ERROR_STATUS"
    | "COUNTRY_SELECTED"
    | "STATE_SELECTED"
    | "CITY_SELECTED";
  payload?: DropdownItem[] | string | DropdownItem;
}
interface DropdownListState  {
  selectedCountry: DropdownItem | undefined;
  selectedState: DropdownItem | undefined;
  selectedCity: DropdownItem | undefined;
  countries: DropdownItem[];
  cities: DropdownItem[];
  states: DropdownItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}
interface AddAddressModalContainerProps {
  hideModal(): void;
  onAddressAddedOrUpdatedCallback?(): void;
  address?: AddressClass /* Address if it exists: In case of Update */;
}

function dropdownListsReducer(
  state: DropdownListState,
  action: DropdownListActions
) {
  switch (action.type) {
    case "FETCHING": {
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: "",
      };
    }
    case "COUNTRY_SELECTED": {
      if (
        typeof action.payload !== "string" &&
        !(action.payload instanceof Array)
      ) {
        return {
          ...state,
          selectedCountry: action.payload,
        };
      }
      return state;
    }
    case "STATE_SELECTED": {
      if (
        typeof action.payload !== "string" &&
        !(action.payload instanceof Array)
      ) {
        return {
          ...state,
          selectedState: action.payload,
        };
      }
      return state;
    }
    case "CITY_SELECTED": {
      if (
        typeof action.payload !== "string" &&
        !(action.payload instanceof Array)
      ) {
        return {
          ...state,
          selectedCity: action.payload,
        };
      }
      return state;
    }
    case "UPDATE_STATES": {
      if (action.payload instanceof Array) {
        return {
          ...state,
          states: action.payload,
          cities: [],
          isLoading: false,
          isError: false,
          errorMessage: "",
        };
      }
      return state;
    }
    case "UPDATE_CITIES": {
      if (action.payload instanceof Array) {
        return {
          ...state,
          cities: action.payload,
          isLoading: false,
          isError: false,
          errorMessage: "",
        };
      }
      return state;
    }
    case "UPDATE_ERROR_STATUS": {
      if (typeof action.payload === "string") {
        return {
          ...state,
          isLoading: false,
          isError: true,
          errorMessage: action.payload,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
const AddAddressModalContainer = (props: AddAddressModalContainerProps) => {
  const {
    hideModal = () => {},
    onAddressAddedOrUpdatedCallback,
    address,
  } = props;

  const { t } = useTranslation();

  /* State to hold initially selected address: In case of update (Default Address) */
  const [initiallySelectedAddress, setInitiallySelectedAddress] = useState<
     {
        selectedCountry: DropdownItem;
        selectedState: DropdownItem;
        selectedCity: DropdownItem;
        addressLine1: string;
        addressLine2: string;
        pincode: string;
      }
    | undefined
  >();

  /* Loading state for Saving the address to DB  */
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const [isSuccessModalShown, setIsSuccessModalShown] = useState(false);

  const [state, dispatch] = useReducer(dropdownListsReducer, {
    selectedCountry: undefined,
    selectedState: undefined,
    selectedCity: undefined,
    countries: COUNTRIES_DROPDOWN_LIST,
    cities: [],
    states: [],
    isLoading: false,
    isError: false,
    errorMessage: "",
  });

  const fetchStatesOfCountry = async (countryName: string) => {
    const response = await CountryApiService.getStatesOfACountry(countryName);
    if (!(response instanceof ApiError)) {
      const statesList = response.states.map((state) => {
        return {
          id: state.state_code,
          text: state.name,
        };
      });
      return statesList;
    } else {
      // Error
      dispatch({
        type: "UPDATE_ERROR_STATUS",
        payload: response.errorResponse?.message || response.errorMessage,
      });
    }
  };

  const fetchCitiesOfState = useCallback(
    async (country: string | undefined, stateName: string) => {
      if (country) {
        const response = await CountryApiService.getCitiesOfAState(
          country,
          stateName
        );
        if (!(response instanceof ApiError)) {
          const citiesList = response.map((city, index) => {
            return {
              id: index,
              text: city,
            };
          });

          return citiesList;
        } else {
          // Error
          dispatch({
            type: "UPDATE_ERROR_STATUS",
            payload: response.errorResponse?.message || response.errorMessage,
          });
        }
      }
    },
    []
  );

  const dropdownChangeHandlers = async (
    key: ADDRESS_FORM_KEYS,
    value: DropdownItem | undefined
  ) => {
    switch (key) {
      case ADDRESS_FORM_KEYS.country: {
        // Fetch States
        if (value?.text) {
          dispatch({ type: "COUNTRY_SELECTED", payload: value });
          dispatch({ type: "FETCHING" });
          const statesList = await fetchStatesOfCountry(value?.text);
          statesList &&
            dispatch({ type: "UPDATE_STATES", payload: statesList });
        }
        return;
      }
      case ADDRESS_FORM_KEYS.state: {
        // Fetch States
        if (value?.text) {
          dispatch({ type: "STATE_SELECTED", payload: value });
          dispatch({ type: "FETCHING" });
          const citiesList = await fetchCitiesOfState(
            state.selectedCountry?.text,
            value?.text
          );
          citiesList &&
            dispatch({ type: "UPDATE_CITIES", payload: citiesList });
        }
        return;
      }
      case ADDRESS_FORM_KEYS.city: {
        // Fetch States
        if (value?.text) {
          dispatch({ type: "CITY_SELECTED", payload: value });
        }
        return;
      }
    }
  };

  const formSubmitHandler = async (data: AddressFormFields) => {
    setUpdateInProgress(true);
    let response: boolean | ApiError;
    if (address) {
      response = await AddressService.updateAddress(
        address?._id,
        data.country.text || "",
        data.state.text || "",
        data.city.text || "",
        data.addressLine1,
        data.addressLine2,
        data.pincode
      );
    } else {
      response = await AddressService.createAddress(
        data.country.text || "",
        data.state.text || "",
        data.city.text || "",
        data.addressLine1,
        data.addressLine2,
        data.pincode
      );
    }

    setUpdateInProgress(false);
    if (!(response instanceof ApiError)) {
      if (onAddressAddedOrUpdatedCallback) {
        onAddressAddedOrUpdatedCallback();
      }
      // Success
      setIsSuccessModalShown(true);
    } else {
      dispatch({
        type: "UPDATE_ERROR_STATUS",
        payload: response.errorResponse?.message || response.errorMessage,
      });
    }
  };

  useEffect(() => {
    const initializeStates = async () => {
      if (address) {
        /* Find selected country in countries dropdown list */
        const countryFound = COUNTRIES_DROPDOWN_LIST.find(
          (country) => country.text === address.country
        );

        if (!countryFound || !countryFound.text) {
          return;
        }

        /* Set selected country */
        dispatch({ type: "COUNTRY_SELECTED", payload: countryFound });

        /* Fetch states of preselected country */
        dispatch({ type: "FETCHING" });
        const statesList = await fetchStatesOfCountry(countryFound.text);
        if (!statesList) {
          return;
        }

        /* Find selected state in states list */
        const stateFound = statesList.find(
          (state) => state.text === address.state
        );

        if (!stateFound) {
          return;
        }

        /* Set states list and selected state */
        dispatch({ type: "STATE_SELECTED", payload: stateFound });
        dispatch({ type: "UPDATE_STATES", payload: statesList });

        /* Fetch Cities */
        dispatch({ type: "FETCHING" });
        const citiesList = await fetchCitiesOfState(
          countryFound.text,
          stateFound.text
        );
        if (!citiesList) {
          return;
        }

        /* Find Selected City In Cities List */
        const cityFound = citiesList.find((city) => city.text === address.city);
        if (!cityFound) {
          return;
        }

        /* Set cities list and selected city */
        dispatch({ type: "CITY_SELECTED", payload: cityFound });
        dispatch({ type: "UPDATE_CITIES", payload: citiesList });

        /* Set Initially selected address */
        setInitiallySelectedAddress({
          selectedCountry: countryFound,
          selectedState: stateFound,
          selectedCity: cityFound,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          pincode: address.pincode,
        });
      }
    };

    initializeStates();
  }, [address, fetchCitiesOfState]);


  return (
    <>
      {isSuccessModalShown ? (
        <FeedbackModal
          messageType="SUCCESS"
          message={t("addressAddedSuccessfully")}
          hideModal={hideModal}
        />
      ) : (
        <AddAddressModal
          countriesList={state.countries}
          citiesList={state.cities}
          statesList={state.states}
          dropdownChangeHandlers={dropdownChangeHandlers}
          formSubmitHandler={formSubmitHandler}
          fetchingDropdownLists={state.isLoading}
          isModalButtonLoading={updateInProgress}
          hideModal={hideModal}
          apiError={state.errorMessage}
          initiallySelectedAddress={initiallySelectedAddress}
        />
      )}
    </>
  );
};

export default AddAddressModalContainer;
