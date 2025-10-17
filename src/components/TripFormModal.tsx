import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  AutoComplete,
} from "antd";
import type { ITrip } from "../types";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import unitOfWork from "../api/unit-of-work";

const { RangePicker } = DatePicker;

interface TripFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (trip: ITrip) => void;
  trip?: ITrip | null;
  mode: "add" | "edit";
}

const TripFormModal: React.FC<TripFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  trip,
  mode,
}) => {
  const [form] = Form.useForm();
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originOptions, setOriginOptions] = useState<
    { label: string; value: string; cityName: string }[]
  >([]);
  const [destinationOptions, setDestinationOptions] = useState<
    { label: string; value: string; cityName: string }[]
  >([]);
  const [selectedOrigin, setSelectedOrigin] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const { data: originData, refetch: refetchOrigin } = useQuery({
    queryKey: ["origin-city", originQuery],
    queryFn: async () => {
      const response = await unitOfWork.amadeus.getCitiesCode(originQuery);
      return response.data;
    },
    enabled: false,
  });

  const { data: destinationData, refetch: refetchDestination } = useQuery({
    queryKey: ["destination-city", destinationQuery],
    queryFn: async () => {
      const response = await unitOfWork.amadeus.getCitiesCode(destinationQuery);
      return response.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (originData && Array.isArray(originData)) {
      setOriginOptions(
        originData.map((city) => ({
          label: `${city.name} (${city.iataCode})`,
          value: city.iataCode,
          cityName: city.name,
        }))
      );
    }
  }, [originData]);

  useEffect(() => {
    if (destinationData && Array.isArray(destinationData)) {
      setDestinationOptions(
        destinationData.map((city) => ({
          label: `${city.name} (${city.iataCode})`,
          value: city.iataCode,
          cityName: city.name,
        }))
      );
    }
  }, [destinationData]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && trip) {
        form.setFieldsValue({
          tripName: trip.tripName,
          origin: `${trip.origin} (${trip.originCityCode})`,
          destination: `${trip.destination} (${trip.destinationCityCode})`,
          dateRange: [dayjs(trip.startDate), dayjs(trip.endDate)],
          budget: trip.budget,
        });
        setSelectedOrigin({ name: trip.origin, code: trip.originCityCode });
        setSelectedDestination({
          name: trip.destination,
          code: trip.destinationCityCode,
        });
      } else {
        form.resetFields();
        setSelectedOrigin(null);
        setSelectedDestination(null);
      }
    }
  }, [open, mode, trip, form]);

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

  const handleOriginSelect = (value: string, option: any) => {
    setSelectedOrigin({ name: option.cityName, code: value });
    // Set the display value in the form
    form.setFieldsValue({
      origin: option.label,
    });
  };

  const handleDestinationSelect = (value: string, option: any) => {
    setSelectedDestination({ name: option.cityName, code: value });
    // Set the display value in the form
    form.setFieldsValue({
      destination: option.label,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedOrigin || !selectedDestination) {
        console.error("Please select origin and destination cities");
        return;
      }

      const tripData: ITrip = {
        ...(mode === "edit" && trip ? { _id: trip._id } : {}),
        tripName: values.tripName,
        origin: selectedOrigin.name,
        originCityCode: selectedOrigin.code,
        destination: selectedDestination.name,
        destinationCityCode: selectedDestination.code,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        budget: values.budget,
        markers: mode === "edit" && trip ? trip.markers : [],
      };
      onSubmit(tripData);
      form.resetFields();
      setSelectedOrigin(null);
      setSelectedDestination(null);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: "20px", fontWeight: 600 }}>
          {mode === "add" ? "Add New Trip" : "Edit Trip"}
        </span>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={mode === "add" ? "Create" : "Update"}
      cancelText="Cancel"
      width={600}
      destroyOnHidden
      styles={{
        body: {
          paddingTop: 24,
        },
      }}
    >
      <Form form={form} layout="vertical" name="tripForm" autoComplete="off">
        <Form.Item
          label="Trip Name"
          name="tripName"
          rules={[
            { required: true, message: "Please enter trip name" },
            { min: 3, message: "Trip name must be at least 3 characters" },
          ]}
        >
          <Input
            placeholder="e.g., Summer in Paris"
            size="large"
            style={{ borderRadius: "6px" }}
          />
        </Form.Item>

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
              originQuery.length > 2 ? "No cities found" : "Type to search..."
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
            disabledDate={(current) => {
              return current && current < dayjs().startOf("day");
            }}
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
      </Form>
    </Modal>
  );
};

export default TripFormModal;
