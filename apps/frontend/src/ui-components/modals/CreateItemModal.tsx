import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit(data: CreateItemFormData): void;
}

export type CreateItemFormData = {
  name: string;
  body: string;
  startPrice: number;
  timeWindow: number;
};
function CreateItemModal(props: CreateItemModalProps) {
  const { isOpen, onClose, onSubmit } = props;
  const { register, handleSubmit } = useForm<CreateItemFormData>();

  function _onSubmit(data: CreateItemFormData) {
    onSubmit(data);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter bid price</ModalHeader>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Item name</FormLabel>
              <Input type="text" {...register("name")} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Item body</FormLabel>
              <Input type="text" {...register("body")} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start price</FormLabel>
              <Input type="number" {...register("startPrice")} required />
            </FormControl>
            <FormControl>
              <FormLabel>Time window</FormLabel>
              <Input type="number" {...register("timeWindow")} required />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CreateItemModal;
