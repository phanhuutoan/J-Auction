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

interface BidPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?(data: BidPriceFormData): void;
}

export type BidPriceFormData = {
  price: number;
};
function BidPriceModal(props: BidPriceModalProps) {
  const { isOpen, onClose, onSubmit } = props;
  const { register, handleSubmit } = useForm<BidPriceFormData>();

  function _onSubmit(data: BidPriceFormData) {
    onSubmit?.(data);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter bid price</ModalHeader>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Your bid price</FormLabel>
              <Input type="number" {...register("price")} required />
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

export default BidPriceModal;
