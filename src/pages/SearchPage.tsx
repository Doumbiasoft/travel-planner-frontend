import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  DatePicker,
  AutoComplete,
  Select,
  Button,
  Spin,
  Tabs,
  Modal,
  Input,
} from "antd";
import { Search, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import unitOfWork from "../api/unit-of-work";
import type { TripOffersData, ITrip } from "../types";
import FlightOfferCard from "../components/FlightOfferCard";
import HotelOfferCard from "../components/HotelOfferCard";
import { formatPriceWithSymbol } from "../utils";
import error_broken from "../assets/images/error-broken.png";
import { ENV } from "../config/env";
import { useAlertNotification } from "../hooks/AlertNotification";

dayjs.extend(utc);

const { RangePicker } = DatePicker;

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const openNotification = useAlertNotification();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<any>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originOptions, setOriginOptions] = useState<
    { label: string; value: string; iataCode: string; cityName: string }[]
  >([]);
  const [destinationOptions, setDestinationOptions] = useState<
    { label: string; value: string; iataCode: string; cityName: string }[]
  >([]);
  const [selectedOrigin, setSelectedOrigin] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [isSaveTripModalOpen, setIsSaveTripModalOpen] = useState(false);
  const [tripName, setTripName] = useState("");

  // Fetch origin cities
  const { data: originData, refetch: refetchOrigin } = useQuery({
    queryKey: ["origin-city", originQuery],
    queryFn: async () => {
      const response = await unitOfWork.amadeus.getCitiesCode(originQuery);
      return response.data;
    },
    enabled: false,
  });

  // Fetch destination cities
  const { data: destinationData, refetch: refetchDestination } = useQuery({
    queryKey: ["destination-city", destinationQuery],
    queryFn: async () => {
      const response = await unitOfWork.amadeus.getCitiesCode(destinationQuery);
      return response.data;
    },
    enabled: false,
  });

  // Fetch offers based on search params
  const {
    data: offersData,
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
  } = useQuery({
    queryKey: ["searchOffers", searchParams],
    queryFn: async () => {
      const response = await unitOfWork.amadeus.getTripOffers(searchParams);
      return response.data as TripOffersData;
    },
    enabled: !!searchParams,
  });

  useEffect(() => {
    if (originData && Array.isArray(originData)) {
      setOriginOptions(
        originData.map((city, index) => ({
          label: `${city.name} (${city.iataCode})`,
          value: `${city.iataCode}-${index}`,
          iataCode: city.iataCode,
          cityName: city.name,
        }))
      );
    }
  }, [originData]);

  useEffect(() => {
    if (destinationData && Array.isArray(destinationData)) {
      setDestinationOptions(
        destinationData.map((city, index) => ({
          label: `${city.name} (${city.iataCode})`,
          value: `${city.iataCode}-${index}`,
          iataCode: city.iataCode,
          cityName: city.name,
        }))
      );
    }
  }, [destinationData]);

  useEffect(() => {
    if (originQuery.length > 2) {
      refetchOrigin();
    }
  }, [originQuery, refetchOrigin]);

  useEffect(() => {
    if (destinationQuery.length > 2) {
      refetchDestination();
    }
  }, [destinationQuery, refetchDestination]);

  const handleOriginSearch = (value: string) => {
    if (value.length > 2) {
      setOriginQuery(value);
    } else {
      setOriginOptions([]);
    }
  };

  const handleDestinationSearch = (value: string) => {
    if (value.length > 2) {
      setDestinationQuery(value);
    } else {
      setDestinationOptions([]);
    }
  };

  const handleOriginSelect = (_value: string, option: any) => {
    setSelectedOrigin({ name: option.cityName, code: option.iataCode });
    form.setFieldsValue({ origin: option.label });
  };

  const handleDestinationSelect = (_value: string, option: any) => {
    setSelectedDestination({ name: option.cityName, code: option.iataCode });
    form.setFieldsValue({ destination: option.label });
  };

  // Create trip mutation
  const createTripMutation = useMutation({
    mutationFn: async (data: ITrip) => await unitOfWork.trip.createTrip(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      openNotification("Trip saved successfully!", "success");
      setIsSaveTripModalOpen(false);
      setTripName("");
      // Navigate to the trips
      if (response.data?.ok) {
        navigate(`/dashboard`);
      }
    },
    onError: (error: any) => {
      if (ENV.VITE_MODE === "development") {
        console.error("Create trip error:", error);
      }
      openNotification(error?.message || "Failed to save trip", "error");
    },
  });

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedOrigin || !selectedDestination) {
        if (ENV.VITE_MODE === "development") {
          console.error("Please select origin and destination cities");
        }
        return;
      }

      const params = {
        originCityCode: selectedOrigin.code,
        destinationCityCode: selectedDestination.code,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        budget: values.budget,
        adults: values.adults,
        children: values.children,
        infants: values.infants,
        travelClass: values.travelClass,
      };

      setSearchParams(params);
    } catch (error) {
      if (ENV.VITE_MODE === "development") {
        console.error("Validation failed:", error);
      }
    }
  };

  const handleOpenSaveTripModal = () => {
    setIsSaveTripModalOpen(true);
  };

  const handleCloseSaveTripModal = () => {
    setIsSaveTripModalOpen(false);
    setTripName("");
  };

  const handleSaveTrip = async () => {
    if (!tripName.trim()) {
      openNotification("Please enter a trip name", "warning");
      return;
    }

    if (!selectedOrigin || !selectedDestination || !searchParams) {
      openNotification("Please complete the search first", "warning");
      return;
    }

    const tripData: ITrip = {
      tripName: tripName.trim(),
      origin: selectedOrigin.name,
      originCityCode: selectedOrigin.code,
      destination: selectedDestination.name,
      destinationCityCode: selectedDestination.code,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      budget: searchParams.budget,
      notifications: {
        priceDrop: true,
        email: true,
      },
      preferences: {
        adults: searchParams.adults,
        children: searchParams.children,
        infants: searchParams.infants,
        travelClass: searchParams.travelClass,
        flexibleDates: false,
      },
      markers: [],
    };

    createTripMutation.mutate(tripData);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Search Offers</h1>
        <p className="text-gray-600 mt-2">
          Find the best flight and hotel packages for your next adventure
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <Form
          form={form}
          layout="vertical"
          name="searchForm"
          autoComplete="off"
          initialValues={{
            adults: 1,
            children: 0,
            infants: 0,
            travelClass: "ECONOMY",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Origin City"
              name="origin"
              rules={[{ required: true, message: "Please select origin city" }]}
              className="autocomplete-field"
            >
              <AutoComplete
                options={originOptions}
                onSearch={handleOriginSearch}
                onSelect={handleOriginSelect}
                placeholder="Type to search (e.g., New York)"
                size="large"
                filterOption={false}
                notFoundContent={
                  originQuery.length > 2
                    ? "No cities found"
                    : "Type to search..."
                }
              />
            </Form.Item>

            <Form.Item
              label="Destination City"
              name="destination"
              rules={[
                { required: true, message: "Please select destination city" },
              ]}
              className="autocomplete-field"
            >
              <AutoComplete
                options={destinationOptions}
                onSearch={handleDestinationSearch}
                onSelect={handleDestinationSelect}
                placeholder="Type to search (e.g., Paris)"
                size="large"
                filterOption={false}
                notFoundContent={
                  destinationQuery.length > 2
                    ? "No cities found"
                    : "Type to search..."
                }
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Travel Dates"
            name="dateRange"
            rules={[{ required: true, message: "Please select travel dates" }]}
          >
            <RangePicker
              size="large"
              className="w-full"
              format="YYYY-MM-DD"
              style={{ borderRadius: "6px" }}
              placeholder={["Start Date", "End Date"]}
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Budget ($)"
            name="budget"
            rules={[
              { required: true, message: "Please enter budget" },
              {
                type: "number",
                min: 1,
                message: "Budget must be greater than 0",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 3500"
              size="large"
              className="w-full"
              style={{ borderRadius: "6px" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <div className="mt-6 mb-2">
            <h3 className="text-base font-semibold text-gray-800">
              Travel Preferences
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Customize your travel search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="Adults (12+)"
              name="adults"
              rules={[
                {
                  type: "number",
                  min: 1,
                  message: "At least 1 adult required",
                },
              ]}
            >
              <InputNumber
                placeholder="1"
                size="large"
                className="w-full"
                style={{ borderRadius: "6px" }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              label="Children (2-11)"
              name="children"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Cannot be negative",
                },
              ]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                className="w-full"
                style={{ borderRadius: "6px" }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="Infants (under 2)"
              name="infants"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Cannot be negative",
                },
              ]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                className="w-full"
                style={{ borderRadius: "6px" }}
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item label="Travel Class" name="travelClass">
            <Select
              size="large"
              style={{ borderRadius: "6px" }}
              options={[
                { value: "ECONOMY", label: "Economy" },
                { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
                { value: "BUSINESS", label: "Business" },
                { value: "FIRST", label: "First Class" },
              ]}
            />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            icon={<Search className="w-4 h-4" />}
            onClick={handleSearch}
            loading={isOffersLoading}
            className="w-full"
            style={{
              backgroundColor: "#FFE566",
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Search Offers
          </Button>
        </Form>
      </div>

      {/* Offers Results */}
      {searchParams && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800">
              Available Offers
            </h3>
            {offersData && !isOffersLoading && !isOffersError && (
              <Button
                type="primary"
                icon={<Save className="w-4 h-4" />}
                onClick={handleOpenSaveTripModal}
                style={{
                  backgroundColor: "#FFE566",
                  borderColor: "#FFE566",
                  color: "#2B2B2B",
                  fontWeight: 600,
                }}
              >
                Save as Trip
              </Button>
            )}
          </div>

          {offersData?.tip && (
            <p className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              💡 {offersData.tip}
            </p>
          )}

          {isOffersLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spin />
              <p className="text-gray-600 mt-4">Searching for offers...</p>
            </div>
          ) : isOffersError ? (
            <div className="flex flex-col text-center py-8 items-center justify-center">
              <img src={error_broken} alt="" className="w-80 h-80" />
              <a href="https://storyset.com/web" className="hidden">
                Error broken
              </a>
              <p className="text-gray-500">
                {offersError instanceof Error
                  ? offersError.message
                  : "Failed to load offers"}
              </p>
            </div>
          ) : offersData ? (
            <Tabs
              defaultActiveKey="recommended"
              items={[
                {
                  key: "recommended",
                  label: "Recommended",
                  children: offersData.recommended ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Flight
                        </h4>
                        <FlightOfferCard
                          flight={offersData.recommended.flight}
                          isRecommended
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Hotel
                        </h4>
                        <HotelOfferCard
                          hotel={offersData.recommended.hotel}
                          isRecommended
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">
                            Combined Package:
                          </span>
                          <span className="text-2xl font-bold text-gray-800">
                            {formatPriceWithSymbol(
                              offersData.recommended.combinedPrice,
                              offersData.recommended.currency
                            )}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Flight:</span>
                            <span>
                              {formatPriceWithSymbol(
                                offersData.recommended.flightPrice,
                                offersData.recommended.currency
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Hotel:</span>
                            <span>
                              {formatPriceWithSymbol(
                                offersData.recommended.hotelPrice,
                                offersData.recommended.currency
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              offersData.recommended.fitsBudget
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {offersData.recommended.fitsBudget
                              ? "✓ Within Budget"
                              : "✗ Over Budget"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-orange-50 p-6 rounded-lg max-w-md">
                        <h4 className="text-lg font-semibold text-orange-800 mb-2">
                          No Recommended Package Available
                        </h4>
                        <p className="text-orange-700">
                          We couldn't find a flight and hotel combination that
                          fits within your budget. Please check the individual
                          flight and hotel tabs to see all available options, or
                          consider adjusting your budget.
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "flights",
                  label: `All Flights (${offersData.flights.length})`,
                  children: (
                    <div className="space-y-4">
                      {offersData.flights.map((flight) => (
                        <FlightOfferCard key={flight.id} flight={flight} />
                      ))}
                    </div>
                  ),
                },
                {
                  key: "hotels",
                  label: `Hotels (${offersData.hotels.length})`,
                  children: (
                    <div className="space-y-4">
                      {offersData.hotels.map((hotel) => (
                        <HotelOfferCard key={hotel.hotelId} hotel={hotel} />
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          ) : null}
        </div>
      )}

      {/* Save Trip Modal */}
      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: 600 }}>
            Save as Trip
          </span>
        }
        open={isSaveTripModalOpen}
        onOk={handleSaveTrip}
        onCancel={handleCloseSaveTripModal}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={createTripMutation.isPending}
        okButtonProps={{
          style: {
            backgroundColor: "#FFE566",
            borderColor: "#FFE566",
            color: "#000000",
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{
          style: {
            color: "#000000",
          },
        }}
      >
        <div className="w-full border-t border-gray-200 mb-5 mt-4"></div>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Give your trip a name to save it and track offers over time.
          </p>
          <Input
            placeholder="e.g., Summer in Paris"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            size="large"
            style={{ borderRadius: "6px" }}
            onPressEnter={handleSaveTrip}
            autoFocus
          />
        </div>
        <div className="w-full border-b border-gray-200"></div>
      </Modal>
    </div>
  );
};

export default SearchPage;
