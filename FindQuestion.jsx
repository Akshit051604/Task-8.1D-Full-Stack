import React, { useEffect, useState } from 'react';
import { Card, Icon, Dropdown } from 'semantic-ui-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import exportfirebase from './firebase';

const QuestionPage = () => {
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            const querySnapshot = await getDocs(collection(exportfirebase.postUpload, 'posts'));
            const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuestions(questionsData);
        };

        fetchQuestions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(exportfirebase.postUpload, 'posts', id));
            setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
        } catch (error) {
            console.log('Error deleting the document: ' + error.message);
        }
    };

    const handleFilterChange = (e, { value }) => setFilter(value);

    const filteredQuestions = questions.filter(({ Title, Tags }) =>
        Title.toLowerCase().includes(filter.toLowerCase()) ||
        (Array.isArray(Tags) && Tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))
    );

    return (
        <div>
            <Dropdown
                placeholder='Filter by title or tag...'
                fluid
                selection
                options={questions.map(question => ({ key: question.id, text: question.Title, value: question.Title }))}
                onChange={handleFilterChange}
                style={{ margin: '20px 0' }}
            />

            <Card.Group>
                {filteredQuestions.map(question => (
                    <Card key={question.id} onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}>
                        <Card.Content>
                            <Card.Header>{question.Title}</Card.Header>
                            <Card.Description>{question.Problem}</Card.Description>
                            <Card.Meta>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name='clock' style={{ marginRight: '5px' }} />
                                    {new Date(question.timestamp.seconds * 1000).toLocaleDateString()}
                                </span>
                                <span style={{ float: 'right' }}>
                                    <Icon name='delete' onClick={(e) => { e.stopPropagation(); handleDelete(question.id); }} />
                                </span>
                            </Card.Meta>
                        </Card.Content>
                        {expandedQuestion === question.id && (
                            <Card.Content extra>
                                <strong>Tags: </strong>{Array.isArray(question.Tags) ? question.Tags.join(', ') : ''}
                            </Card.Content>
                        )}
                    </Card>
                ))}
            </Card.Group>
        </div>
    );
};

export default QuestionPage;
