-- Add sample posts data for demonstration (first create some sample profiles)
INSERT INTO public.profiles (user_id, username, display_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alex_writer', 'Alex Thompson'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah_blogger', 'Sarah Chen'),
('550e8400-e29b-41d4-a716-446655440003', 'mike_storyteller', 'Mike Rodriguez')
ON CONFLICT (user_id) DO NOTHING;

-- Add sample posts with proper user_ids that reference the profiles
INSERT INTO public.posts (id, title, content, excerpt, user_id, published, reading_time, views_count, likes_count, category, tags, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'The Future of AI in Creative Writing', 'Artificial Intelligence is revolutionizing the way we approach creative writing. From generating ideas to polishing prose, AI tools are becoming indispensable companions for writers across all genres. This comprehensive exploration delves into the current state of AI writing tools, their capabilities, limitations, and the exciting possibilities they present for the future of literature and content creation.

In recent years, we''ve witnessed unprecedented advances in natural language processing, with models like GPT becoming increasingly sophisticated in their ability to understand context, maintain coherence, and even exhibit creativity. These developments have sparked both excitement and concern within the writing community, as authors grapple with questions about authenticity, originality, and the fundamental nature of creativity itself.

The integration of AI into the writing process is not about replacing human creativity but rather augmenting it. Writers are discovering that AI can serve as a powerful brainstorming partner, helping to overcome writer''s block, generate fresh perspectives on familiar topics, and even assist with technical aspects like grammar and style refinement. The key lies in understanding how to effectively collaborate with these tools while maintaining one''s unique voice and artistic vision.', 'Exploring how AI is transforming the creative writing landscape and what it means for writers', '550e8400-e29b-41d4-a716-446655440001', true, 5, 1234, 89, 'technology', ARRAY['AI', 'writing', 'creativity'], '2024-07-20 10:00:00+00'),

('00000000-0000-0000-0000-000000000002', 'Building Sustainable Communities', 'In an era of rapid urbanization and environmental challenges, creating sustainable communities has become more important than ever. This comprehensive guide explores practical strategies for developing eco-friendly neighborhoods that not only minimize environmental impact but also foster social cohesion and economic prosperity.

The concept of sustainability in community development extends far beyond simply ''going green.'' It encompasses a holistic approach that considers environmental, social, and economic factors in every decision. From energy-efficient building designs and renewable energy systems to local food production and waste reduction programs, sustainable communities represent a fundamental shift in how we think about urban planning and development.

One of the most critical aspects of building sustainable communities is engaging residents from the very beginning. Community-driven initiatives tend to be more successful and long-lasting because they reflect the actual needs and desires of the people who live there. This participatory approach ensures that sustainability measures are not just imposed from above but are embraced and maintained by the community itself.', 'A comprehensive guide to creating eco-friendly neighborhoods that thrive', '550e8400-e29b-41d4-a716-446655440002', true, 8, 2156, 134, 'environment', ARRAY['sustainability', 'community', 'environment'], '2024-07-19 14:30:00+00'),

('00000000-0000-0000-0000-000000000003', 'The Art of Digital Storytelling', 'Digital storytelling combines traditional narrative techniques with modern technology to create compelling experiences that resonate with contemporary audiences. This post explores the fundamental principles and tools needed to master this increasingly important craft in our interconnected world.

At its core, digital storytelling is about using technology to enhance rather than replace traditional storytelling elements. The best digital stories still rely on strong characters, compelling conflicts, and satisfying resolutions. However, they leverage multimedia elements—images, audio, video, interactive components—to create more immersive and engaging experiences for their audiences.

The democratization of content creation tools has made digital storytelling accessible to everyone. No longer do you need expensive equipment or extensive technical knowledge to create professional-quality content. With smartphones, free editing software, and online platforms, anyone with a story to tell can reach a global audience.', 'Mastering the craft of digital narrative in the modern age', '550e8400-e29b-41d4-a716-446655440003', true, 6, 987, 76, 'media', ARRAY['storytelling', 'digital', 'multimedia'], '2024-07-18 09:15:00+00'),

('00000000-0000-0000-0000-000000000004', 'Climate Change Solutions for the Next Decade', 'As we face the climate crisis, innovative solutions are emerging from unexpected places. This article examines cutting-edge technologies and community initiatives that are making a real difference in the fight against global warming and environmental degradation.

The next decade will be crucial in determining humanity''s response to climate change. While the challenges are immense, there''s reason for optimism as breakthrough technologies and grassroots movements gain momentum around the world. From revolutionary carbon capture systems to community-based renewable energy projects, solutions are emerging at every scale.

Innovation in clean technology is accelerating at an unprecedented pace. Solar and wind power costs have plummeted, making renewable energy competitive with fossil fuels in many markets. Meanwhile, advances in battery technology are solving the storage challenges that have long hindered renewable adoption. Electric vehicles are becoming mainstream, and new mobility solutions are reducing transportation emissions in urban areas.', 'Innovative approaches to tackle climate change in the coming decade', '550e8400-e29b-41d4-a716-446655440001', true, 10, 3421, 198, 'environment', ARRAY['climate', 'innovation', 'sustainability'], '2024-07-17 16:45:00+00'),

('00000000-0000-0000-0000-000000000005', 'The Psychology of Remote Work', 'Remote work has fundamentally changed how we think about productivity, collaboration, and work-life balance. This deep dive explores the psychological aspects of working from home and provides insights for both employees and managers navigating this new landscape.

The shift to remote work, accelerated by global events, has created the largest workplace experiment in modern history. Millions of workers worldwide have had to adapt to new ways of collaborating, communicating, and maintaining productivity outside traditional office environments. This massive change has revealed both the benefits and challenges of distributed work arrangements.

Understanding the psychological impact of remote work is crucial for both individual success and organizational effectiveness. While many workers report increased autonomy and better work-life integration, others struggle with isolation, blurred boundaries, and the challenges of self-motivation. The key is developing strategies that leverage the benefits while mitigating the potential downsides.', 'Understanding the mental aspects of remote work and digital collaboration', '550e8400-e29b-41d4-a716-446655440002', true, 7, 1876, 112, 'workplace', ARRAY['remote work', 'psychology', 'productivity'], '2024-07-16 11:20:00+00');

-- Update the reading time calculation for better accuracy
UPDATE public.posts SET reading_time = CEIL(LENGTH(content) / 200.0) WHERE reading_time IS NULL;