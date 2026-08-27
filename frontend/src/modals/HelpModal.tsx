import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { getLocale, T } from "src/locale";
import { getHelpFile } from "src/locale/src/HelpDoc";
import EasyModal, { type InnerModalProps } from "src/modules/easyModal";

interface Props extends InnerModalProps {
	section: string;
}

const showHelpModal = (section: string) => {
	EasyModal.show(HelpModal, { section });
};

const HelpModal = EasyModal.create(({ section, visible, remove }: Props) => {
	const [markdownText, setMarkdownText] = useState("");
	const lang = getLocale(true);

	useEffect(() => {
		void (async () => {
			try {
				const docFile = getHelpFile(lang, section) as any;
				const response = await fetch(docFile);
				setMarkdownText(await response.text());
			} catch (ex: any) {
				setMarkdownText(`**ERROR:** ${ex.message}`);
			}
		})();
	}, [lang, section]);

	return (
		<Modal show={visible} onHide={remove}>
			<Modal.Header closeButton>
				<Modal.Title>
					<T id="help" />
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Markdown options={{ disableParsingRawHTML: true }}>{markdownText}</Markdown>
			</Modal.Body>
		</Modal>
	);
});

export { showHelpModal };
