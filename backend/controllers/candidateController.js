import Candidate from '../models/Candidate.js';

// @desc    Add a new candidate
// @route   POST /api/candidates
// @access  Public
export const addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    const candidateExists = await Candidate.findOne({ email });

    if (candidateExists) {
      return res.status(400).json({ message: 'Candidate already exists' });
    }

    const candidate = await Candidate.create({
      name,
      email,
      skills,
      experience,
      bio,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match candidates based on job requirements
// @route   POST /api/match
// @access  Public
export const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minimumExperience } = req.body;

    const candidates = await Candidate.find({});

    const reqSkillsLower = requiredSkills.map((s) => s.toLowerCase());
    const prefSkillsLower = preferredSkills.map((s) => s.toLowerCase());

    const matchedCandidates = candidates.map((candidate) => {
      const candidateSkills = candidate.skills.map((s) => s.toLowerCase());

      // Calculate skill overlap percentage based on required skills
      const matchedReqSkills = candidateSkills.filter((skill) =>
        reqSkillsLower.includes(skill)
      );
      
      const matchedPrefSkills = candidateSkills.filter((skill) =>
        prefSkillsLower.includes(skill)
      );

      const requiredMatchScore = reqSkillsLower.length > 0 
        ? (matchedReqSkills.length / reqSkillsLower.length) * 100 
        : 100;
      
      const preferredMatchScore = prefSkillsLower.length > 0
        ? (matchedPrefSkills.length / prefSkillsLower.length) * 100
        : 0;

      // Overall score: 70% required, 30% preferred (if any)
      let overallScore = 0;
      if (prefSkillsLower.length > 0) {
        overallScore = (requiredMatchScore * 0.7) + (preferredMatchScore * 0.3);
      } else {
        overallScore = requiredMatchScore;
      }

      // Check experience
      const meetsExperience = candidate.experience >= minimumExperience;

      let category = 'Low Match';
      if (overallScore >= 80 && meetsExperience) {
        category = 'High Match';
      } else if (overallScore >= 50) {
        category = 'Medium Match';
      }

      return {
        ...candidate._doc,
        matchScore: overallScore.toFixed(2),
        matchedSkills: [...matchedReqSkills, ...matchedPrefSkills],
        meetsExperience,
        category,
      };
    });

    // Sort by match score descending
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
